'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var recaptchaScript = void 0;

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
          onResolved = _props.onResolved;

      window.GoogleRecaptchaResolved = onResolved;
      window.GoogleRecaptchaLoaded = function () {
        var recaptchaId = grecaptcha.render(_this2.container, {
          sitekey: sitekey,
          size: 'invisible',
          badge: badge,
          callback: 'GoogleRecaptchaResolved'
        });
        _this2.execute = function () {
          return grecaptcha.execute(recaptchaId);
        };
        _this2.reset = function () {
          return grecaptcha.reset(recaptchaId);
        };
        _this2.getResponse = function () {
          return grecaptcha.getResponse(recaptchaId);
        };
      };

      if (!recaptchaScript) {
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
        recaptchaScript = script;
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement('div', { ref: function ref(_ref) {
          return _this3.container = _ref;
        }, style: { display: 'none' } });
    }
  }]);

  return GoogleRecaptcha;
}(_react2.default.Component);

GoogleRecaptcha.propTypes = {
  sitekey: _propTypes2.default.string.isRequired,
  locale: _propTypes2.default.string,
  onResolved: _propTypes2.default.func.isRequired
};

GoogleRecaptcha.defaultProps = {
  locale: 'en'
};

exports.default = GoogleRecaptcha;