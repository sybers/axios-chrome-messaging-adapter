export function isArrayBuffer(type, val) {
  // @ts-ignore
  // eslint-disable-next-line
  return ![, null].includes(val) && val.constructor === type;
}

export function isArrayBufferDataUrl(data: string) {
  const regex = /^data:encoded-array-buffer(;base64)?,([a-z0-9!$&',()*+;=\-._~:@\/?%\s]*?)$/i;

  return regex.test((data || '').trim());
}

export function arrayBufferToDataURL(buffer: ArrayBuffer) {
  return `data:encoded-array-buffer;base64,${arrayBufferToBase64(buffer)}`;
}

export function dataURLToArrayBuffer(data: string) {
  return base64ToArrayBuffer(data.substring(data.indexOf(',') + 1));
}

function arrayBufferToBase64(buffer) {
  var binary = '';
  var bytes = new Uint8Array(buffer);
  var len = bytes.byteLength;
  for (var i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
