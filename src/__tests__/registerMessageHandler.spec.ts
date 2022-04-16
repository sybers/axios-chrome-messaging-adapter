import { chrome } from 'jest-chrome';
import nock from 'nock';
import { registerMessageHandler } from '../registerMessageHandler';
import { AxiosMessagingAdapterResponse } from '../types';

function registerListenerPromise() {
  let listener;
  chrome.runtime.onMessage.addListener = (func) => (listener = func);

  registerMessageHandler();

  return (request: any) =>
    new Promise<AxiosMessagingAdapterResponse | undefined>((resolve) => {
      const returnValue = listener(request, undefined, resolve);
      if (returnValue === false) resolve(undefined);
    });
}

describe('registerMessageHandler.ts', () => {
  beforeAll(() => {
    chrome.runtime.getManifest.mockReturnValue({
      manifest_version: 2
    } as any);

    nock('https://example.com').persist().get('/').reply(200, null, {
      'Access-Control-Allow-Methods':
        'PUT, OPTIONS, CONNECT, PATCH, GET, HEAD, POST, DELETE, TRACE',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Expose-Headers': 'link, etag, location',
      'Access-Control-Allow-Headers': 'user-agent'
    });
  });

  it('registers a chrome onMessage event listener', () => {
    const addListenerSpy = jest.fn();
    chrome.runtime.onMessage.addListener = addListenerSpy;

    registerMessageHandler();

    expect(addListenerSpy).toHaveBeenCalledWith(expect.anything());
  });

  it('only responds to "axiosMessagingAdapterRequest" requests', async () => {
    const listener = registerListenerPromise();

    registerMessageHandler();

    // this request is handled by our message handler
    const handledRequest = await listener({
      name: 'axiosMessagingAdapterRequest',
      axiosConfig: { baseURL: 'https://example.com' }
    });

    // our custom listener won't catch this request as the name doesn't match
    const skippedRequest = await listener({
      name: 'invalid_name',
      axiosConfig: { baseURL: 'https://example.com' }
    });

    // request was handled, the response should contain either an error or an axios response
    expect(handledRequest).toEqual(
      expect.objectContaining({ response: expect.anything() })
    );
    // undefined response means our listener skipped the request
    expect(skippedRequest).toBeUndefined();
  });

  it('shows a warning if no adapter was specified and running in manifest v3 context', async () => {
    chrome.runtime.getManifest.mockReturnValueOnce({
      manifest_version: 3
    } as any);

    const listener = registerListenerPromise();
    const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

    await listener({
      name: 'axiosMessagingAdapterRequest',
      axiosConfig: { baseURL: 'https://example.com' }
    });

    expect(consoleWarnMock).toHaveBeenCalledWith(
      expect.stringContaining('manifest v3')
    );
  });

  it('uses a custom adapter if provided', async () => {
    const listener = registerListenerPromise();

    const mockAdapter = jest.fn().mockReturnValue(Promise.resolve());

    registerMessageHandler({ adapter: mockAdapter });

    await listener({
      name: 'axiosMessagingAdapterRequest',
      axiosConfig: { baseURL: 'https://example.com' }
    });

    expect(mockAdapter).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://example.com'
      })
    );
  });
});
