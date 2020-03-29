# axios-chrome-messaging-adapter

Axios adapter to pass the requests to a Chrome Extension background script. Useful to avoid CORB in content scripts.

More informations about CORB [here](https://www.chromestatus.com/feature/5629709824032768) and [here](https://www.chromium.org/Home/chromium-security/extension-content-script-fetches).

## Getting Started

### Prerequisites

This axios adapter is **only intended to be used in Chrome extensions**, it simply forwards axios requests to the background script, using the `chrome.runtime.sendMessage(...)` API.

### Installation

#### With npm (or yarn)

```
$ npm install --save axios-chrome-messaging-adapter
$ # Or
$ yarn add axios-chrome-messaging-adapter
```

#### With a CDN

Axios must be available as a global object so you'll need to import it from a CDN too, we use **unpkg** here as an example.

```html
<script src="https://unpkg.com/axios@0.18.0/dist/axios.min.js"></script>
<script src="https://unpkg.com/axios-chrome-messaging-adapter@0.3.1/dist/axios-chrome-messaging-adapter.min.js"></script>
```

### Quick start

If you are using a bundler, like webpack or rollup:, you'll just need to **`require`** the lib. If you are using a CDN, the lib will be available under **`window.axiosChromeMessagingAdapter`**.

In your **background** script:

```javascript
import axios from 'axios';
import { registerMessageHandler } from 'axios-chrome-messaging-adapter';

// register the adapter message hanlder
registerMessageHandler();
```

In your **content** script:

```javascript
import axios from 'axios'
import { adapter } from 'axios-chrome-messaging-adapter'

// tell axios to use the adapter for this request
const axiosInstance = axios.create({
  adapter,
  ... // the rest of your configuration :)
})
```

## Known limitations

The adapter is currently incompatible with the following axios parameters:

- paramsSerializer
- onUploadProgress
- onDownloadProgress
- cancelToken

This limitation is due to the fact that only scalar values can pass through the chrome messaging API, making these callbacks functions unavailable for the moment.

If one of these options is used, it will be ignored and the content script will emit a warning.

## Development

Clone the project to the directory and install dependencies

```bash
$ git clone https://github.com/dzetah/axios-chrome-messaging-adapter
$ cd axios-chrome-messaging-adapter
$ yarn # or npm install
$ npm i --no-save axios # install axios peer dependency
```

Start typescript compilation in watch mode

```bash
$ npm run watch
```
