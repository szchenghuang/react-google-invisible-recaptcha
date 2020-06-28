"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var prop_types_1 = __importDefault(require("prop-types"));
var uuid_1 = require("uuid");
var renderers = [];
var injectScript = function (locale, nonce, trustedTypesPolicy) {
    window.GoogleRecaptchaLoaded = function () {
        while (renderers.length) {
            var renderer = renderers.shift();
            if (renderer)
                renderer();
        }
    };
    var recaptchaSource = "https://www.google.com/recaptcha/api.js?" + (locale && 'hl=' + locale) + "&onload=GoogleRecaptchaLoaded&render=explicit";
    if (typeof window.trustedTypes !== 'undefined' && trustedTypesPolicy) {
        recaptchaSource = trustedTypesPolicy.createScriptURL(recaptchaSource);
    }
    var script = document.createElement('script');
    script.async = true;
    script.defer = true;
    script.id = 'recaptcha';
    script.onerror = function (error) {
        throw error;
    };
    script.src = recaptchaSource;
    script.type = 'text/javascript';
    nonce && script.setAttribute('nonce', nonce);
    document.body.appendChild(script);
};
var GoogleRecaptcha = /** @class */ (function (_super) {
    __extends(GoogleRecaptcha, _super);
    function GoogleRecaptcha() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.container = null;
        _this.callbackName = 'GoogleRecaptchaResolved';
        _this.execute = function () { };
        _this.reset = function () { };
        _this.getResponse = function () { return ''; };
        return _this;
    }
    GoogleRecaptcha.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, badge = _a.badge, locale = _a.locale, nonce = _a.nonce, onExpired = _a.onExpired, onError = _a.onError, onLoaded = _a.onLoaded, onResolved = _a.onResolved, sitekey = _a.sitekey, tabindex = _a.tabindex, trustedTypesPolicy = _a.trustedTypesPolicy;
        this.callbackName = 'GoogleRecaptchaResolved-' + uuid_1.v4();
        window[this.callbackName] = onResolved;
        var loaded = function () {
            if (_this.container) {
                var wrapper = document.createElement('div');
                // This wrapper must be appended to the DOM immediately before rendering
                // reCaptcha. Otherwise multiple reCaptchas will act jointly somehow.
                _this.container.appendChild(wrapper);
                var recaptchaId_1 = window.grecaptcha.render(wrapper, {
                    badge: badge,
                    'callback': _this.callbackName,
                    'error-callback': onError,
                    'expired-callback': onExpired,
                    sitekey: sitekey,
                    'size': 'invisible',
                    tabindex: tabindex,
                });
                _this.execute = function () { return window.grecaptcha.execute(recaptchaId_1); };
                _this.reset = function () { return window.grecaptcha.reset(recaptchaId_1); };
                _this.getResponse = function () { return window.grecaptcha.getResponse(recaptchaId_1); };
                if (onLoaded)
                    onLoaded();
            }
        };
        if (window.grecaptcha &&
            window.grecaptcha.render &&
            window.grecaptcha.execute &&
            window.grecaptcha.reset &&
            window.grecaptcha.getResponse) {
            loaded();
        }
        else {
            renderers.push(loaded);
            if (!document.getElementById('recaptcha')) {
                injectScript(locale, nonce, trustedTypesPolicy);
            }
        }
    };
    GoogleRecaptcha.prototype.componentWillUnmount = function () {
        var _a;
        while ((_a = this.container) === null || _a === void 0 ? void 0 : _a.firstChild) {
            this.container.removeChild(this.container.firstChild);
        }
        if (this.reset) {
            this.reset();
        }
        delete window[this.callbackName];
    };
    GoogleRecaptcha.prototype.render = function () {
        var _this = this;
        var style = this.props.style;
        return (react_1.default.createElement("div", __assign({ ref: function (ref) { return _this.container = ref; } }, (style && { style: style }))));
    };
    GoogleRecaptcha.propTypes = {
        badge: prop_types_1.default.oneOf(['bottomright', 'bottomleft', 'inline']),
        locale: prop_types_1.default.string,
        nonce: prop_types_1.default.string,
        onExpired: prop_types_1.default.func,
        onError: prop_types_1.default.func,
        onResolved: prop_types_1.default.func,
        onLoaded: prop_types_1.default.func,
        sitekey: prop_types_1.default.string.isRequired,
        style: prop_types_1.default.object,
        tabindex: prop_types_1.default.number,
        trustedTypesPolicy: prop_types_1.default.object,
    };
    GoogleRecaptcha.defaultProps = {
        badge: 'bottomright',
        locale: '',
        onExpired: function () { },
        onError: function () { },
        onLoaded: function () { },
        onResolved: function () { },
        tabindex: 0,
        trustedTypesPolicy: null,
    };
    return GoogleRecaptcha;
}(react_1.Component));
exports.default = GoogleRecaptcha;
//# sourceMappingURL=index.js.map