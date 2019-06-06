import { AxiosRequestConfig, AxiosPromise } from 'axios';
import { adapter } from './adapter';
import { registerMessageHandler } from './registerMessageHandler';

interface AxiosChromeMessagingAdapter {
  (config: AxiosRequestConfig): AxiosPromise;

  registerMessageHandler(): void;
}

(adapter as AxiosChromeMessagingAdapter).registerMessageHandler = registerMessageHandler;

// tslint:disable-next-line:no-default-export
export default adapter;
