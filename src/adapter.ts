import { AxiosRequestConfig, AxiosPromise } from 'axios';

function filterUnsupportedConfig(config: AxiosRequestConfig) {
  const unsupportedConfigs = ['paramsSerializer', 'onUploadProgress', 'onDownloadProgress', 'cancelToken'];
  const filtered = Object.keys(config)
      .filter((key) => {
          const inBlackList = unsupportedConfigs.indexOf(key) !== -1;
          if (inBlackList) {
              console.warn(`Axios Chrome Messaging adapter: skipped unsupported axios configuration "${key}"`);
          }

          return !inBlackList;
      })
      .reduce((acc, key) => {
          acc[key] = config[key];

          return acc;
      }, {});

  return filtered;
}

export function adapter(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const messageConfig = {
      name: 'axiosMessagingAdapterRequest',
      config: filterUnsupportedConfig(config),
    };

    chrome.runtime.sendMessage(messageConfig, (message) => {
        // there was an error with the chrome messaging API
        if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError);
        }

        // the request errored
        if (message.error) {
            reject(message.error);
        }

        resolve(message.response);
    });
  });
}
