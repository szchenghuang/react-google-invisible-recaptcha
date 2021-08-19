import * as React from 'react';
import { v4 as uuid } from 'uuid';

declare global {
  interface Window {
    grecaptcha: {
      render?: (
        wrapper: HTMLElement,
        options: {
          badge: Props['badge'];
          callback: string;
          'error-callback': () => void;
          'expired-callback': () => void;
          sitekey: string;
          size: 'invisible';
          tabindex: number;
        }
      ) => string;
      execute?: (recaptchaId: string) => void;
      reset?: (recaptchaId: string) => void;
      getResponse?: (recaptchaId: string) => string;
    };
    GoogleRecaptchaLoaded: () => void;
  }
}

const renderers: (() => void)[] = [];

const injectScript = (locale: string, nonce?: string) => {
  window.GoogleRecaptchaLoaded = () => {
    while (renderers.length) {
      const renderer = renderers.shift();
      renderer?.();
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

export type Callbacks = {
  execute: () => void;
  getResponse: () => string | undefined;
  reset: () => void;
};

type Props = {
  badge?: 'bottomright' | 'bottomleft' | 'inline',
  locale?: string,
  nonce?: string,
  onExpired?: () => void,
  onError?: () => void,
  onLoaded?: () => void,
  onResolved?: () => void,
  sitekey: string,
  style?: React.CSSProperties,
  tabindex?: number,
};

const defaultProps = {
  badge: 'bottomright' as const,
  locale: '',
  onExpired: () => undefined,
  onError: () => undefined,
  onLoaded: () => undefined,
  onResolved: () => undefined,
  tabindex: 0,
};

const GoogleRecaptcha = React.forwardRef(function(
  props: Props,
  ref: React.ForwardedRef<HTMLDivElement & { callbacks?: Callbacks }>
) {
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
    // @ts-expect-error window attachment.
    window[ callbackName ] = onResolved;

    if (typeof ref === 'function' || !ref?.current) {
      return;
    }

    const domNode = ref.current;

    const loaded = () => {
      if (ref.current) {
        const wrapper = document.createElement('div');
        // This wrapper must be appended to the DOM immediately before rendering
        // reCaptcha. Otherwise multiple reCaptchas will act jointly somehow.
        ref.current.appendChild(wrapper);
        const recaptchaId = window.grecaptcha.render?.(wrapper, {
          badge,
          callback: callbackName,
          'error-callback': onError,
          'expired-callback': onExpired,
          sitekey,
          size: 'invisible',
          tabindex,
        });
        if (recaptchaId !== undefined && recaptchaId !== null) {
          ref.current.callbacks = {
            execute: () => window.grecaptcha.execute?.(recaptchaId),
            getResponse: () => window.grecaptcha.getResponse?.(recaptchaId),
            reset: () => window.grecaptcha.reset?.(recaptchaId),
          };
          onLoaded();
        }
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
      while (domNode?.firstChild) {
        domNode.removeChild(domNode.firstChild);
      }

      // There is a chance that the reCAPTCHA API lib is not loaded yet, so check
      // before invoking reset.
      ref.current?.callbacks?.reset();

      // @ts-expect-error window attachment.
      delete window[ callbackName ];
    };
  }, []);

  return <div ref={ref} style={style} />;
});

GoogleRecaptcha.defaultProps = defaultProps;

GoogleRecaptcha.displayName = 'GoogleRecaptcha';

export default GoogleRecaptcha;
