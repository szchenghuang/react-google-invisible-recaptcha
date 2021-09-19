"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var React = _interopRequireWildcard(require("react"));

var _uuid = require("uuid");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var renderers = [];

var injectScript = function injectScript(locale, nonce) {
  window.GoogleRecaptchaLoaded = function () {
    while (renderers.length) {
      var renderer = renderers.shift();
      renderer === null || renderer === void 0 ? void 0 : renderer();
    }
  };

  var script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.id = 'recaptcha';

  script.onerror = function (error) {
    throw error;
  };

  script.src = "https://www.google.com/recaptcha/api.js?".concat(locale && 'hl=' + locale, "&onload=GoogleRecaptchaLoaded&render=explicit");
  script.type = 'text/javascript';
  nonce && script.setAttribute("nonce", nonce);
  document.body.appendChild(script);
};

var defaultProps = {
  badge: 'bottomright',
  locale: '',
  onExpired: function onExpired() {
    return undefined;
  },
  onError: function onError() {
    return undefined;
  },
  onLoaded: function onLoaded() {
    return undefined;
  },
  onResolved: function onResolved() {
    return undefined;
  },
  tabindex: 0
};
var GoogleRecaptcha = /*#__PURE__*/React.forwardRef(function (props, ref) {
  var _props$badge = props.badge,
      badge = _props$badge === void 0 ? defaultProps.badge : _props$badge,
      _props$locale = props.locale,
      locale = _props$locale === void 0 ? defaultProps.locale : _props$locale,
      nonce = props.nonce,
      _props$onExpired = props.onExpired,
      onExpired = _props$onExpired === void 0 ? defaultProps.onExpired : _props$onExpired,
      _props$onError = props.onError,
      onError = _props$onError === void 0 ? defaultProps.onError : _props$onError,
      _props$onLoaded = props.onLoaded,
      onLoaded = _props$onLoaded === void 0 ? defaultProps.onLoaded : _props$onLoaded,
      _props$onResolved = props.onResolved,
      onResolved = _props$onResolved === void 0 ? defaultProps.onResolved : _props$onResolved,
      sitekey = props.sitekey,
      style = props.style,
      _props$tabindex = props.tabindex,
      tabindex = _props$tabindex === void 0 ? defaultProps.tabindex : _props$tabindex;
  var callbackName = 'GoogleRecaptchaResolved-' + (0, _uuid.v4)();
  React.useEffect(function () {
    // @ts-expect-error window attachment.
    window[callbackName] = onResolved;

    if (typeof ref === 'function' || !(ref !== null && ref !== void 0 && ref.current)) {
      return;
    }

    var domNode = ref.current;

    var loaded = function loaded() {
      if (ref.current) {
        var _window$grecaptcha$re, _window$grecaptcha;

        var _wrapper = document.createElement('div'); // This wrapper must be appended to the DOM immediately before rendering
        // reCaptcha. Otherwise multiple reCaptchas will act jointly somehow.


        ref.current.appendChild(_wrapper);

        var _recaptchaId = (_window$grecaptcha$re = (_window$grecaptcha = window.grecaptcha).render) === null || _window$grecaptcha$re === void 0 ? void 0 : _window$grecaptcha$re.call(_window$grecaptcha, _wrapper, {
          badge: badge,
          callback: callbackName,
          'error-callback': onError,
          'expired-callback': onExpired,
          sitekey: sitekey,
          size: 'invisible',
          tabindex: tabindex
        });

        if (_recaptchaId !== undefined && _recaptchaId !== null) {
          ref.current.callbacks = {
            execute: function execute() {
              var _window$grecaptcha$ex, _window$grecaptcha2;

              return (_window$grecaptcha$ex = (_window$grecaptcha2 = window.grecaptcha).execute) === null || _window$grecaptcha$ex === void 0 ? void 0 : _window$grecaptcha$ex.call(_window$grecaptcha2, _recaptchaId);
            },
            getResponse: function getResponse() {
              var _window$grecaptcha$ge, _window$grecaptcha3;

              return (_window$grecaptcha$ge = (_window$grecaptcha3 = window.grecaptcha).getResponse) === null || _window$grecaptcha$ge === void 0 ? void 0 : _window$grecaptcha$ge.call(_window$grecaptcha3, _recaptchaId);
            },
            reset: function reset() {
              var _window$grecaptcha$re2, _window$grecaptcha4;

              return (_window$grecaptcha$re2 = (_window$grecaptcha4 = window.grecaptcha).reset) === null || _window$grecaptcha$re2 === void 0 ? void 0 : _window$grecaptcha$re2.call(_window$grecaptcha4, _recaptchaId);
            }
          };
          onLoaded();
        }
      }
    };

    if (window.grecaptcha && window.grecaptcha.render && window.grecaptcha.execute && window.grecaptcha.reset && window.grecaptcha.getResponse) {
      loaded();
    } else {
      renderers.push(loaded);

      if (!document.querySelector('#recaptcha')) {
        injectScript(locale, nonce);
      }
    }

    return function () {
      var _ref$current, _ref$current$callback;

      while (domNode !== null && domNode !== void 0 && domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
      } // There is a chance that the reCAPTCHA API lib is not loaded yet, so check
      // before invoking reset.


      (_ref$current = ref.current) === null || _ref$current === void 0 ? void 0 : (_ref$current$callback = _ref$current.callbacks) === null || _ref$current$callback === void 0 ? void 0 : _ref$current$callback.reset(); // @ts-expect-error window attachment.

      delete window[callbackName];
    };
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    ref: ref,
    style: style
  });
});
GoogleRecaptcha.defaultProps = defaultProps;
GoogleRecaptcha.displayName = 'GoogleRecaptcha';
var _default = GoogleRecaptcha;
exports["default"] = _default;