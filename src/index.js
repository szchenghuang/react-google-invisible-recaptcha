import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

const renderers = [];

const injectScript = ( locale, nonce ) => {
  window.GoogleRecaptchaLoaded = () => {
    while ( renderers.length ) {
      const renderer = renderers.shift();
      renderer();
    }
  };

  const script = document.createElement( 'script' );
  script.async = true;
  script.defer = true;
  script.id = 'recaptcha';
  script.onerror = function( error ) { throw error; };
  script.src = `https://www.google.com/recaptcha/api.js?${ locale && 'hl=' + locale }&onload=GoogleRecaptchaLoaded&render=explicit`;
  script.type = 'text/javascript';
  nonce && script.setAttribute("nonce", nonce);
  document.body.appendChild( script );
};

class GoogleRecaptcha extends React.Component {
  componentDidMount() {
    const {
      badge,
      locale,
      nonce,
      onExpired,
      onError,
      onLoaded,
      onResolved,
      sitekey,
      tabindex,
    } = this.props;

    this.callbackName = 'GoogleRecaptchaResolved-' + uuid();
    window[ this.callbackName ] = onResolved;

    const loaded = () => {
      if ( this.container ) {
        const wrapper = document.createElement( 'div' );
        // This wrapper must be appended to the DOM immediately before rendering
        // reCaptcha. Otherwise multiple reCaptchas will act jointly somehow.
        this.container.appendChild( wrapper );
        const recaptchaId = window.grecaptcha.render( wrapper, {
          badge,
          callback: this.callbackName,
          'error-callback': onError,
          'expired-callback': onExpired,
          sitekey,
          size: 'invisible',
          tabindex,
        });
        this.execute = () => window.grecaptcha.execute( recaptchaId );
        this.reset = () => window.grecaptcha.reset( recaptchaId );
        this.getResponse = () => window.grecaptcha.getResponse( recaptchaId );
        onLoaded();
      }
    };

    if ( window.grecaptcha &&
      window.grecaptcha.render &&
      window.grecaptcha.execute &&
      window.grecaptcha.reset &&
      window.grecaptcha.getResponse
    ) {
      loaded();
    } else {
      renderers.push( loaded );
      if ( !document.querySelector( '#recaptcha' ) ) {
        injectScript( locale, nonce );
      }
    }
  }
  componentWillUnmount() {
    while ( this.container.firstChild ) {
      this.container.removeChild( this.container.firstChild );
    }
    // There is a chance that the reCAPTCHA API lib is not loaded yet, so check
    // before invoking reset.
    if ( this.reset ) {
      this.reset();
    }
    delete window[ this.callbackName ];
  }
  render() {
    const { style } = this.props;
    return (
      <div
        ref={ ref => this.container = ref }
        { ...( style && { style } ) } />
    );
  }
}

GoogleRecaptcha.propTypes = {
  badge: PropTypes.oneOf( [ 'bottomright', 'bottomleft', 'inline' ] ),
  locale: PropTypes.string,
  nonce: PropTypes.string,
  onExpired: PropTypes.func,
  onError: PropTypes.func,
  onResolved: PropTypes.func,
  onLoaded: PropTypes.func,
  sitekey: PropTypes.string.isRequired,
  style: PropTypes.object,
  tabindex: PropTypes.number,
};

GoogleRecaptcha.defaultProps = {
  badge: 'bottomright',
  locale: '',
  onExpired: () => {},
  onError: () => {},
  onLoaded: () => {},
  onResolved: () => {},
  tabindex: 0,
};

export default GoogleRecaptcha;
