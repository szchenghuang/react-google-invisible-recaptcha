import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

const renderers = [];

const injectScript = locale => {
  window.GoogleRecaptchaLoaded = () => {
    while ( renderers.length ) {
      const renderer = renderers.shift();
      renderer();
    }
  };

  const script = document.createElement( 'script' );
  script.id = 'recaptcha';
  script.src = `https://www.google.com/recaptcha/api.js?hl=${locale}&onload=GoogleRecaptchaLoaded&render=explicit`;
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.onerror = function( error ) { throw error; };
  document.body.appendChild( script );
};

class GoogleRecaptcha extends React.Component {
  componentDidMount() {
    const {
      sitekey,
      locale,
      badge,
      tabindex,
      onResolved,
      onError,
      onExpired,
      onLoaded
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
          sitekey,
          size: 'invisible',
          badge,
          tabindex,
          callback: this.callbackName,
          'error-callback': onError,
          'expired-callback': onExpired
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
        injectScript( locale );
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
  sitekey: PropTypes.string.isRequired,
  locale: PropTypes.string,
  badge: PropTypes.oneOf( [ 'bottomright', 'bottomleft', 'inline' ] ),
  tabindex: PropTypes.number,
  onResolved: PropTypes.func,
  onError: PropTypes.func,
  onExpired: PropTypes.func,
  onLoaded: PropTypes.func,
  style: PropTypes.object
};

GoogleRecaptcha.defaultProps = {
  locale: 'en',
  badge: 'bottomright',
  tabindex: 0,
  onResolved: () => {},
  onError: () => {},
  onExpired: () => {},
  onLoaded: () => {}
};

export default GoogleRecaptcha;
