import { AxiosRequestConfig, AxiosPromise } from 'axios';
import {
  AxiosMessagingAdapterConfig,
  AxiosMessagingAdapterResponse
} from './types';
import { arrayBufferToDataURL, isArrayBuffer } from './utils';

export const unsupportedAxiosOptions = [
  'paramsSerializer',
  'onUploadProgress',
  'onDownloadProgress',
  'cancelToken',
  'transformRequest',
  'transformResponse'
] as const;

function filterUnsupportedConfig(
  config: AxiosRequestConfig
): AxiosMessagingAdapterConfig {
  const filteredConfig: Partial<AxiosRequestConfig> = Object.keys(config)
    .filter((key) => {
      const isUnsupported = unsupportedAxiosOptions.indexOf(key as any) !== -1;
      if (isUnsupported) {
        console.warn(
          `Axios Chrome Messaging adapter: skipped unsupported axios option "${key}"`
        );
      }

      return !isUnsupported;
    })
    .reduce((acc, key) => {
      acc[key] = config[key];

      return acc;
    }, {});

  return filteredConfig;
}

export function adapter(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const filteredConfig = filterUnsupportedConfig(config);

    if (isArrayBuffer(filteredConfig.data)) {
      filteredConfig.data = arrayBufferToDataURL(filteredConfig.data);
    }

    chrome.runtime.sendMessage(
      {
        name: 'axiosMessagingAdapterRequest',
        axiosConfig: filterUnsupportedConfig(config)
      },
      (message: AxiosMessagingAdapterResponse) => {
        // there was an error with the chrome messaging API
        if (chrome.runtime.lastError) {
          return reject(chrome.runtime.lastError);
        }

        // the request errored
        if (message.error) {
          return reject(message.error);
        }

        return resolve(message.response);
      }
    );
  });
}
