import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {v4 as uuid} from 'uuid';

type RecaptchaWindow = typeof window & {
  GoogleRecaptchaLoaded: () => void;
  [GoogleRecaptchaResolved: string]:
    | ((recaptchaToken: string) => void)
    | undefined;
};

const renderers: (() => void)[] = [];

const injectScript = (
  locale?: string,
  nonce?: string,
  trustedTypesPolicy?: TrustedTypePolicy
) => {
  (window as RecaptchaWindow).GoogleRecaptchaLoaded = () => {
    while (renderers.length) {
      const renderer = renderers.shift();
      if (renderer) renderer();
    }
  };

  let recaptchaSource:
    | string
    | TrustedScriptURL = `https://www.google.com/recaptcha/api.js?${
    locale && 'hl=' + locale
  }&onload=GoogleRecaptchaLoaded&render=explicit`;

  if (typeof window.trustedTypes !== 'undefined' && trustedTypesPolicy) {
    recaptchaSource = trustedTypesPolicy.createScriptURL(recaptchaSource);
  }

  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.id = 'recaptcha';
  script.onerror = function (error) {
    throw error;
  };
  script.src = recaptchaSource as string;
  script.type = 'text/javascript';
  nonce && script.setAttribute('nonce', nonce);
  document.body.appendChild(script);
};

interface GoogleRecaptchaProps {
  badge?: 'bottomright' | 'bottomleft' | 'inline';
  locale?: string;
  nonce?: string;
  onExpired?: () => void | Promise<void>;
  onError?: () => void | Promise<void>;
  onResolved?: (recaptchaToken: string) => void | Promise<void>;
  onLoaded?: () => void | Promise<void>;
  sitekey: string;
  style?: {[key: string]: string | number};
  tabindex?: number;
  trustedTypesPolicy?: TrustedTypePolicy;
}

class GoogleRecaptcha extends Component<GoogleRecaptchaProps> {
  static propTypes = {
    badge: PropTypes.oneOf(['bottomright', 'bottomleft', 'inline']),
    locale: PropTypes.string,
    nonce: PropTypes.string,
    onExpired: PropTypes.func,
    onError: PropTypes.func,
    onResolved: PropTypes.func,
    onLoaded: PropTypes.func,
    sitekey: PropTypes.string.isRequired,
    style: PropTypes.object,
    tabindex: PropTypes.number,
    trustedTypesPolicy: PropTypes.object,
  };

  static defaultProps = {
    badge: 'bottomright',
    locale: '',
    onExpired: () => {},
    onError: () => {},
    onLoaded: () => {},
    onResolved: () => {},
    tabindex: 0,
    trustedTypesPolicy: null,
  };

  container: HTMLElement | null = null;
  callbackName = 'GoogleRecaptchaResolved';
  execute: () => void = () => {};
  reset: () => void = () => {};
  getResponse: () => string = () => '';

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
      trustedTypesPolicy,
    } = this.props;

    this.callbackName = 'GoogleRecaptchaResolved-' + uuid();
    (window as RecaptchaWindow)[this.callbackName] = function (...args) {
      return new Promise(() => {
        if (onResolved) onResolved(...args);
      });
    };

    const loaded = () => {
      if (this.container) {
        const wrapper = document.createElement('div');
        // This wrapper must be appended to the DOM immediately before rendering
        // reCaptcha. Otherwise multiple reCaptchas will act jointly somehow.
        this.container.appendChild(wrapper);
        const recaptchaId = window.grecaptcha.render(wrapper, {
          badge,
          callback: (window as RecaptchaWindow)[this.callbackName],
          'error-callback': onError,
          'expired-callback': onExpired,
          sitekey,
          size: 'invisible',
          tabindex,
        });
        this.execute = () => window.grecaptcha.execute(recaptchaId);
        this.reset = () => window.grecaptcha.reset(recaptchaId);
        this.getResponse = () => window.grecaptcha.getResponse(recaptchaId);

        if (onLoaded) onLoaded();
      }
    };

    if (
      window.grecaptcha &&
      window.grecaptcha.render &&
      window.grecaptcha.execute &&
      window.grecaptcha.reset &&
      window.grecaptcha.getResponse
    ) {
      loaded();
    } else {
      renderers.push(loaded);
      if (!document.getElementById('recaptcha')) {
        injectScript(locale, nonce, trustedTypesPolicy);
      }
    }
  }

  componentWillUnmount() {
    while (this.container?.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    if (this.reset) {
      this.reset();
    }

    delete (window as RecaptchaWindow)[this.callbackName];
  }

  render() {
    const {style} = this.props;
    return (
      <div ref={(ref) => (this.container = ref)} {...(style && {style})} />
    );
  }
}

export default GoogleRecaptcha;
