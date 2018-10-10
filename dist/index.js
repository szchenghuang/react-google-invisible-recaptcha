'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var renderers = [];

var injectScript = function injectScript(locale) {
  window.GoogleRecaptchaLoaded = function () {
    while (renderers.length) {
      var renderer = renderers.shift();
      renderer();
    }
  };

  var script = document.createElement('script');
  script.id = 'recaptcha';
  script.src = 'https://www.google.com/recaptcha/api.js?hl=' + locale + '&onload=GoogleRecaptchaLoaded&render=explicit';
  script.type = 'text/javascript';
  script.async = true;
  script.defer = true;
  script.onerror = function (error) {
    throw error;
  };
  document.body.appendChild(script);
};

var GoogleRecaptcha = function (_React$Component) {
  _inherits(GoogleRecaptcha, _React$Component);

  function GoogleRecaptcha() {
    _classCallCheck(this, GoogleRecaptcha);

    return _possibleConstructorReturn(this, (GoogleRecaptcha.__proto__ || Object.getPrototypeOf(GoogleRecaptcha)).apply(this, arguments));
  }

  _createClass(GoogleRecaptcha, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var _props = this.props,
          sitekey = _props.sitekey,
          locale = _props.locale,
          badge = _props.badge,
          tabindex = _props.tabindex,
          onResolved = _props.onResolved,
          onError = _props.onError,
          onExpired = _props.onExpired,
          onLoaded = _props.onLoaded;


      this.callbackName = 'GoogleRecaptchaResolved-' + (0, _v2.default)();
      window[this.callbackName] = onResolved;

      var loaded = function loaded() {
        if (_this2.container) {
          var wrapper = document.createElement('div');
          // This wrapper must be appended to the DOM immediately before rendering
          // reCaptcha. Otherwise multiple reCaptchas will act jointly somehow.
          _this2.container.appendChild(wrapper);
          var recaptchaId = window.grecaptcha.render(wrapper, {
            sitekey: sitekey,
            size: 'invisible',
            badge: badge,
            tabindex: tabindex,
            callback: _this2.callbackName,
            'error-callback': onError,
            'expired-callback': onExpired
          });
          _this2.execute = function () {
            return window.grecaptcha.execute(recaptchaId);
          };
          _this2.reset = function () {
            return window.grecaptcha.reset(recaptchaId);
          };
          _this2.getResponse = function () {
            return window.grecaptcha.getResponse(recaptchaId);
          };
          onLoaded();
        }
      };

      if (window.grecaptcha && window.grecaptcha.render && window.grecaptcha.execute && window.grecaptcha.reset && window.grecaptcha.getResponse) {
        loaded();
      } else {
        renderers.push(loaded);
        if (!document.querySelector('#recaptcha')) {
          injectScript(locale);
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
      // There is a chance that the reCAPTCHA API lib is not loaded yet, so check
      // before invoking reset.
      if (this.reset) {
        this.reset();
      }
      delete window[this.callbackName];
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var style = this.props.style;

      return _react2.default.createElement('div', _extends({
        ref: function ref(_ref) {
          return _this3.container = _ref;
        }
      }, style && { style: style }));
    }
  }]);

  return GoogleRecaptcha;
}(_react2.default.Component);

GoogleRecaptcha.propTypes = {
  sitekey: _propTypes2.default.string.isRequired,
  locale: _propTypes2.default.string,
  badge: _propTypes2.default.oneOf(['bottomright', 'bottomleft', 'inline']),
  tabindex: _propTypes2.default.number,
  onResolved: _propTypes2.default.func,
  onError: _propTypes2.default.func,
  onExpired: _propTypes2.default.func,
  onLoaded: _propTypes2.default.func,
  style: _propTypes2.default.object
};

GoogleRecaptcha.defaultProps = {
  locale: 'en',
  badge: 'bottomright',
  tabindex: 0,
  onResolved: function onResolved() {},
  onError: function onError() {},
  onExpired: function onExpired() {},
  onLoaded: function onLoaded() {}
};

exports.default = GoogleRecaptcha;