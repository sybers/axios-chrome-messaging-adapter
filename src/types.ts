import { AxiosRequestConfig, AxiosPromise } from 'axios';

export interface AxiosChromeMessagingAdapter {
    (config: AxiosRequestConfig): AxiosPromise;

    registerMessageHandler(): void;
}