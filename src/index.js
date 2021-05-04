import PropTypes from 'prop-types';
import React from 'react';
import uuid from 'uuid/v4';

const renderers = [];

const injectScript = (locale, nonce) => {
  window.GoogleRecaptchaLoaded = () => {
    while (renderers.length) {
      const renderer = renderers.shift();
      renderer();
    }
  };

  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.id = 'recaptcha';
  script.onerror = function(error) { throw error; };
  script.src = `https://www.google.com/recaptcha/api.js?${ locale && 'hl=' + locale }&onload=GoogleRecaptchaLoaded&render=explicit`;
  script.type = 'text/javascript';
  nonce && script.setAttribute("nonce", nonce);
  document.body.appendChild(script);
};

const defaultProps = {
  badge: 'bottomright',
  locale: '',
  onExpired: () => {},
  onError: () => {},
  onLoaded: () => {},
  onResolved: () => {},
  tabindex: 0,
};

function GoogleRecaptcha(props, refContainer) {
  const {
    badge = defaultProps.badge,
    locale = defaultProps.locale,
    nonce,
    onExpired = defaultProps.onExpired,
    onError = defaultProps.onError,
    onLoaded = defaultProps.onLoaded,
    onResolved = defaultProps.onResolved,
    sitekey,
    style,
    tabindex = defaultProps.tabindex,
  } = props;

  const callbackName = 'GoogleRecaptchaResolved-' + uuid();

  React.useEffect(() => {
    window[ callbackName ] = onResolved;

    const domNode = refContainer.current;
    let callbacks = {};

    const loaded = () => {
      if (refContainer.current) {
        const wrapper = document.createElement('div');
        // This wrapper must be appended to the DOM immediately before rendering
        // reCaptcha. Otherwise multiple reCaptchas will act jointly somehow.
        refContainer.current.appendChild(wrapper);
        const recaptchaId = window.grecaptcha.render(wrapper, {
          badge,
          callback: callbackName,
          'error-callback': onError,
          'expired-callback': onExpired,
          sitekey,
          size: 'invisible',
          tabindex,
        });
        refContainer.current.callbacks = {
          execute: () => window.grecaptcha.execute(recaptchaId),
          reset: () => window.grecaptcha.reset(recaptchaId),
          getResponse: () => window.grecaptcha.getResponse(recaptchaId),
        };
        callbacks = { ...refContainer.current.callbacks };
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
      renderers.push(loaded);
      if (!document.querySelector('#recaptcha')) {
        injectScript(locale, nonce);
      }
    }

    return () => {
      while (domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
      }

      // There is a chance that the reCAPTCHA API lib is not loaded yet, so check
      // before invoking reset.
      if (callbacks.reset) {
        callbacks.reset();
      }

      delete window[ callbackName ];
    };
  }, []);

  return <div ref={refContainer} {...(style && { style })} />;
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

GoogleRecaptcha.defaultProps = defaultProps;

export default React.forwardRef(GoogleRecaptcha);
