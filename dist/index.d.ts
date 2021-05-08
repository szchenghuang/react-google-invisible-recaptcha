import * as React from 'react';
declare global {
    interface Window {
        grecaptcha: {
            render?: (wrapper: HTMLElement, options: {
                badge: Props['badge'];
                callback: string;
                'error-callback': () => void;
                'expired-callback': () => void;
                sitekey: string;
                size: 'invisible';
                tabindex: number;
            }) => string;
            execute?: (recaptchaId: string) => void;
            reset?: (recaptchaId: string) => void;
            getResponse?: (recaptchaId: string) => string;
        };
        GoogleRecaptchaLoaded: () => void;
    }
}
export declare type Callbacks = {
    execute: () => void;
    getResponse: () => string | undefined;
    reset: () => void;
};
declare type Props = {
    badge?: 'bottomright' | 'bottomleft' | 'inline';
    locale?: string;
    nonce?: string;
    onExpired?: () => void;
    onError?: () => void;
    onLoaded?: () => void;
    onResolved?: () => void;
    sitekey: string;
    style?: React.CSSProperties;
    tabindex?: number;
};
declare const GoogleRecaptcha: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLDivElement & {
    callbacks?: Callbacks | undefined;
}>>;
export default GoogleRecaptcha;
