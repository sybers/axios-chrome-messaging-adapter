import axios from 'axios';
import { dataURLToArrayBuffer, isArrayBufferDataUrl } from './utils';

export function registerMessageHandler() {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.name === 'axiosMessagingAdapterRequest') {
      // perform axios request in the background script

      if (isArrayBufferDataUrl(request.config.data)) {
        request.config.data = dataURLToArrayBuffer(request.config.data);
      }

      axios(request.config)
        .then((response) => sendResponse({ response }))
        .catch((error) => sendResponse({ error }));

      return true;
    }

    return false;
  });
}
