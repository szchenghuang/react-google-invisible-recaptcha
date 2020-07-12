/// <reference types="trusted-types" />
import { Component } from 'react';
import PropTypes from 'prop-types';
interface GoogleRecaptchaProps {
    badge?: 'bottomright' | 'bottomleft' | 'inline';
    locale?: string;
    nonce?: string;
    onExpired?: () => void | Promise<void>;
    onError?: () => void | Promise<void>;
    onResolved?: (recaptchaToken: string) => void | Promise<void>;
    onLoaded?: () => void | Promise<void>;
    sitekey: string;
    style?: {
        [key: string]: string | number;
    };
    tabindex?: number;
    trustedTypesPolicy?: TrustedTypePolicy;
}
declare class GoogleRecaptcha extends Component<GoogleRecaptchaProps> {
    static propTypes: {
        badge: PropTypes.Requireable<string>;
        locale: PropTypes.Requireable<string>;
        nonce: PropTypes.Requireable<string>;
        onExpired: PropTypes.Requireable<(...args: any[]) => any>;
        onError: PropTypes.Requireable<(...args: any[]) => any>;
        onResolved: PropTypes.Requireable<(...args: any[]) => any>;
        onLoaded: PropTypes.Requireable<(...args: any[]) => any>;
        sitekey: PropTypes.Validator<string>;
        style: PropTypes.Requireable<object>;
        tabindex: PropTypes.Requireable<number>;
        trustedTypesPolicy: PropTypes.Requireable<object>;
    };
    static defaultProps: {
        badge: string;
        locale: string;
        onExpired: () => void;
        onError: () => void;
        onLoaded: () => void;
        onResolved: () => void;
        tabindex: number;
        trustedTypesPolicy: null;
    };
    container: HTMLElement | null;
    callbackName: string;
    execute: () => void;
    reset: () => void;
    getResponse: () => string;
    componentDidMount(): void;
    componentWillUnmount(): void;
    render(): JSX.Element;
}
export default GoogleRecaptcha;
//# sourceMappingURL=index.d.ts.map