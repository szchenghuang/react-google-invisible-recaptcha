import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

let recaptchaScript;

class GoogleRecaptcha extends React.Component {
  componentDidMount() {
    const { sitekey, locale, badge, onResolved } = this.props;
    this.callbackName = 'GoogleRecaptchaResolved-' + uuid();

    window[ this.callbackName ] = onResolved;

    const initialize = () => {
      const recaptchaId = grecaptcha.render( this.container, {
        sitekey,
        size: 'invisible',
        badge,
        callback: this.callbackName
      });
      this.execute = () => grecaptcha.execute( recaptchaId );
      this.reset = () => grecaptcha.reset( recaptchaId );
      this.getResponse = () => grecaptcha.getResponse( recaptchaId );
    };

    if ( recaptchaScript ) {
      initialize();
    } else {
      window.GoogleRecaptchaLoaded = () => initialize();

      const script = document.createElement( 'script' );
      script.id = 'recaptcha';
      script.src = `https://www.google.com/recaptcha/api.js?hl=${locale}&onload=GoogleRecaptchaLoaded&render=explicit`;
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      script.onerror = function( error ) { throw error; };
      document.body.appendChild( script );
      recaptchaScript = script;
    }
  }
  componentWillUnmount() {
    delete window[ this.callbackName ];
  }
  render() {
    return (
      <div ref={ ref => this.container = ref } style={ { display: 'none' } } />
    );
  }
}

GoogleRecaptcha.propTypes = {
  sitekey: PropTypes.string.isRequired,
  locale: PropTypes.string,
  onResolved: PropTypes.func.isRequired
};

GoogleRecaptcha.defaultProps = {
  locale: 'en'
};

export default GoogleRecaptcha;
