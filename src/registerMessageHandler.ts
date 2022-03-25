import 'regenerator-runtime/runtime';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
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

        // If running in a Manifest v3 service worker
        if (typeof XMLHttpRequest == 'undefined') {
          request.axiosConfig.adapter = fetchAdapter;
        }

        // Fixes breaking requests
        if (
          request.axiosConfig.transformRequest.length === 1 &&
          request.axiosConfig.transformRequest[0] === null
        ) {
          request.axiosConfig.transformRequest = [];
        }

        // Fixes breaking requests
        if (
          request.axiosConfig.transformResponse.length === 1 &&
          request.axiosConfig.transformResponse[0] === null
        ) {
          request.axiosConfig.transformResponse = [];
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
