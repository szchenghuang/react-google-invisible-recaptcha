import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid/v4';

const renderers = [];

const injectScript = locale => {
  window.GoogleRecaptchaLoaded = () => {
    while ( renderers.length ) {
      const renderer = renderers.pop();
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
    const { sitekey, locale, badge, onResolved } = this.props;

    this.callbackName = 'GoogleRecaptchaResolved-' + uuid();
    window[ this.callbackName ] = onResolved;

    const loaded = () => {
      if ( this.container ) {
        const recaptchaId = window.grecaptcha.render( this.container, {
          sitekey,
          size: 'invisible',
          badge,
          callback: this.callbackName
        });
        this.execute = () => window.grecaptcha.execute( recaptchaId );
        this.reset = () => window.grecaptcha.reset( recaptchaId );
        this.getResponse = () => window.grecaptcha.getResponse( recaptchaId );
      }
    };

    if ( window.grecaptcha ) {
      loaded();
    } else {
      renderers.push( loaded );
      if ( !document.querySelector( '#recaptcha' ) ) {
        injectScript( locale, loaded );
      }
    }
  }
  componentWillUnmount() {
    delete window[ this.callbackName ];
    delete this.container;
  }
  render() {
    const style = { display: 'none', ...this.props.style };
    return (
      <div ref={ ref => this.container = ref } style={ style } />
    );
  }
}

GoogleRecaptcha.propTypes = {
  sitekey: PropTypes.string.isRequired,
  locale: PropTypes.string,
  onResolved: PropTypes.func.isRequired,
  style: PropTypes.object
};

GoogleRecaptcha.defaultProps = {
  locale: 'en'
};

export default GoogleRecaptcha;
