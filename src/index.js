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
    const { sitekey, locale, badge, onResolved, onLoaded } = this.props;

    this.callbackName = 'GoogleRecaptchaResolved-' + uuid();
    window[ this.callbackName ] = onResolved;

    const loaded = () => {
      if ( this.container ) {
        const wrapper = document.createElement("div");
        const recaptchaId = window.grecaptcha.render( wrapper, {
          sitekey,
          size: 'invisible',
          badge,
          callback: this.callbackName
        });
        this.container.appendChild(wrapper);
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
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    this.reset();
    delete window[ this.callbackName ];
  }
  render() {
    const { style } = this.props;
    return (
      <div ref={ ref => this.container = ref } style={ style } />
    );
  }
}

GoogleRecaptcha.propTypes = {
  sitekey: PropTypes.string.isRequired,
  locale: PropTypes.string,
  badge: PropTypes.oneOf( [ 'bottomright', 'bottomleft', 'inline' ] ),
  onResolved: PropTypes.func.isRequired,
  onLoaded: PropTypes.func,
  style: PropTypes.object
};

GoogleRecaptcha.defaultProps = {
  locale: 'en',
  badge: 'bottomright',
  onLoaded: () => {}
};

export default GoogleRecaptcha;
