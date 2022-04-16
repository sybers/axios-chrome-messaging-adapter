import axios, { AxiosAdapter } from 'axios';
import {
  AxiosMessagingAdapterRequest,
  AxiosMessagingAdapterResponse
} from './types';
import {
  isChromeManifestV3,
  dataURLToArrayBuffer,
  isArrayBufferDataUrl
} from './utils';

export type AxiosChromeMessageHandlerConfig = {
  adapter?: AxiosAdapter;
};

export function registerMessageHandler(
  config: AxiosChromeMessageHandlerConfig = {}
): void {
  chrome.runtime.onMessage.addListener(
    (
      request: AxiosMessagingAdapterRequest,
      _,
      sendResponse: (response: AxiosMessagingAdapterResponse) => void
    ) => {
      if (request.name === 'axiosMessagingAdapterRequest') {
        // perform axios request in the background script

        // If running in a Manifest v3 service worker,
        // user must specify an adapter when registering the message handler.
        if (isChromeManifestV3() && !config.adapter) {
          const error = new Error(
            'When using manifest v3, XMLHttpRequest is not available in service workers please use a custom adapter.'
          );

          console.warn(error.message);
          sendResponse({ error });
          return true;
        }

        if (config.adapter) {
          request.axiosConfig.adapter = config.adapter;
        }

        if (isArrayBufferDataUrl(request.axiosConfig.data)) {
          request.axiosConfig.data = dataURLToArrayBuffer(
            request.axiosConfig.data
          );
        }

        axios(request.axiosConfig)
          .then((response) => sendResponse({ response }))
          .catch((error) => sendResponse({ error }));

        return true;
      }

      return false;
    }
  );
}
