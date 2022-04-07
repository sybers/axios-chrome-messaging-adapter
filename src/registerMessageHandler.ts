import axios from 'axios';
import {
  AxiosMessagingAdapterRequest,
  AxiosMessagingAdapterResponse
} from './types';
import { dataURLToArrayBuffer, isArrayBufferDataUrl } from './utils';

export function registerMessageHandler(): void {
  chrome.runtime.onMessage.addListener(
    (
      request: AxiosMessagingAdapterRequest,
      _,
      sendResponse: (response: AxiosMessagingAdapterResponse) => void
    ) => {
      if (request.name === 'axiosMessagingAdapterRequest') {
        // perform axios request in the background script

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
