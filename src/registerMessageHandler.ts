import axios from 'axios';

export function registerMessageHandler() {
  chrome.runtime.onMessage.addListener((request, _, sendResponse) => {
      if (request.name === 'axiosMessagingAdapterRequest') {
          // perform axios request in the background script
          axios(request.config)
              .then((response) => sendResponse({ response }))
              .catch((error) => sendResponse({ error }));

          return true;
      }

      return false;
  });
}
