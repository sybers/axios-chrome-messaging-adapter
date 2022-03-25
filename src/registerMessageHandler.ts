import 'regenerator-runtime/runtime';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
import axios from 'axios';
import { dataURLToArrayBuffer, isArrayBufferDataUrl } from './utils';

export function registerMessageHandler(): void {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
    if (request.name === 'axiosMessagingAdapterRequest') {
      // perform axios request in the background script

      // If running in a Manifest v3 service worker
      if (typeof XMLHttpRequest == 'undefined') {
        request.config.adapter = fetchAdapter;
      }

      // Fixes breaking requests
      if (request.config.transformRequest.length === 1 && request.config.transformRequest[0] === null) {
        request.config.transformRequest = [];
      }

      // Fixes breaking requests
      if (request.config.transformResponse.length === 1 && request.config.transformResponse[0] === null) {
        request.config.transformResponse = [];
      }

      if (request.config.data && isArrayBufferDataUrl(request.config.data)) {
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
