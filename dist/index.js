'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renderers = [];

var injectScript = function injectScript(locale, nonce) {
  window.GoogleRecaptchaLoaded = function () {
    while (renderers.length) {
      var renderer = renderers.shift();
      renderer();
    }
  };

  var script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.id = 'recaptcha';
  script.onerror = function (error) {
    throw error;
  };
  script.src = 'https://www.google.com/recaptcha/api.js?' + (locale && 'hl=' + locale) + '&onload=GoogleRecaptchaLoaded&render=explicit';
  script.type = 'text/javascript';
  nonce && script.setAttribute("nonce", nonce);
  document.body.appendChild(script);
};

var defaultProps = {
  badge: 'bottomright',
  locale: '',
  onExpired: function onExpired() {},
  onError: function onError() {},
  onLoaded: function onLoaded() {},
  onResolved: function onResolved() {},
  tabindex: 0
};

function GoogleRecaptcha(props, refContainer) {
  var _props$badge = props.badge,
      badge = _props$badge === undefined ? defaultProps.badge : _props$badge,
      _props$locale = props.locale,
      locale = _props$locale === undefined ? defaultProps.locale : _props$locale,
      nonce = props.nonce,
      _props$onExpired = props.onExpired,
      onExpired = _props$onExpired === undefined ? defaultProps.onExpired : _props$onExpired,
      _props$onError = props.onError,
      onError = _props$onError === undefined ? defaultProps.onError : _props$onError,
      _props$onLoaded = props.onLoaded,
      onLoaded = _props$onLoaded === undefined ? defaultProps.onLoaded : _props$onLoaded,
      _props$onResolved = props.onResolved,
      onResolved = _props$onResolved === undefined ? defaultProps.onResolved : _props$onResolved,
      sitekey = props.sitekey,
      style = props.style,
      _props$tabindex = props.tabindex,
      tabindex = _props$tabindex === undefined ? defaultProps.tabindex : _props$tabindex;


  var callbackName = 'GoogleRecaptchaResolved-' + (0, _v2.default)();

  _react2.default.useEffect(function () {
    window[callbackName] = onResolved;

    var domNode = refContainer.current;
    var callbacks = {};

    var loaded = function loaded() {
      if (refContainer.current) {
        var wrapper = document.createElement('div');
        // This wrapper must be appended to the DOM immediately before rendering
        // reCaptcha. Otherwise multiple reCaptchas will act jointly somehow.
        refContainer.current.appendChild(wrapper);
        var recaptchaId = window.grecaptcha.render(wrapper, {
          badge: badge,
          callback: callbackName,
          'error-callback': onError,
          'expired-callback': onExpired,
          sitekey: sitekey,
          size: 'invisible',
          tabindex: tabindex
        });
        refContainer.current.callbacks = {
          execute: function execute() {
            return window.grecaptcha.execute(recaptchaId);
          },
          reset: function reset() {
            return window.grecaptcha.reset(recaptchaId);
          },
          getResponse: function getResponse() {
            return window.grecaptcha.getResponse(recaptchaId);
          }
        };
        callbacks = _extends({}, refContainer.current.callbacks);
        onLoaded();
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
      while (domNode.firstChild) {
        domNode.removeChild(domNode.firstChild);
      }

      // There is a chance that the reCAPTCHA API lib is not loaded yet, so check
      // before invoking reset.
      if (callbacks.reset) {
        callbacks.reset();
      }

      delete window[callbackName];
    };
  }, []);

  return _react2.default.createElement('div', _extends({ ref: refContainer }, style && { style: style }));
}

GoogleRecaptcha.propTypes = {
  badge: _propTypes2.default.oneOf(['bottomright', 'bottomleft', 'inline']),
  locale: _propTypes2.default.string,
  nonce: _propTypes2.default.string,
  onExpired: _propTypes2.default.func,
  onError: _propTypes2.default.func,
  onResolved: _propTypes2.default.func,
  onLoaded: _propTypes2.default.func,
  sitekey: _propTypes2.default.string.isRequired,
  style: _propTypes2.default.object,
  tabindex: _propTypes2.default.number
};

GoogleRecaptcha.defaultProps = defaultProps;

exports.default = _react2.default.forwardRef(GoogleRecaptcha);