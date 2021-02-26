import { chrome } from 'jest-chrome';
import { adapter } from '../adapter';

describe('adapter', () => {
  afterEach(() => {
    delete chrome.runtime.lastError;
  });

  it('sends a chrome message named "axiosMessagingAdapterRequest" containing the axios config', async () => {
    chrome.runtime.sendMessage.mockImplementationOnce((_, callback) => {
      callback({ response: 'Mocked response' });
    });

    await adapter({ baseURL: 'https://example.com ' });

    expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
      {
        name: 'axiosMessagingAdapterRequest',
        axiosConfig: { baseURL: 'https://example.com ' }
      },
      expect.anything()
    );
  });

  it.each([
    'paramsSerializer',
    'onUploadProgress',
    'onDownloadProgress',
    'cancelToken'
  ])(
    'filters unsupported %p axios configuration and issues a warning',
    async (unsupportedOption) => {
      chrome.runtime.sendMessage.mockImplementationOnce((_, callback) => {
        callback({ response: 'Mocked response' });
      });

      const consoleWarnMock = jest.spyOn(console, 'warn').mockImplementation();

      await adapter({
        baseURL: 'https://example.com',
        [unsupportedOption]: () => {
          console.log('unsupported option');
          return '';
        }
      });

      expect(consoleWarnMock).toHaveBeenCalledWith(
        expect.stringContaining(unsupportedOption)
      );
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith(
        {
          name: 'axiosMessagingAdapterRequest',
          axiosConfig: { baseURL: 'https://example.com ' }
        },
        expect.anything()
      );
      consoleWarnMock.mockRestore();
    }
  );

  it('rejects if there was an internal error with the chrome API (chrome.runtime.lastError)', async () => {
    chrome.runtime.sendMessage.mockImplementationOnce((_, callback) => {
      chrome.runtime.lastError = new Error('Chrome API error');

      callback();
    });

    await expect(adapter({})).rejects.toThrowError('Chrome API error');
  });

  it('rejects if there was an error with the axios request', async () => {
    chrome.runtime.sendMessage.mockImplementationOnce((_, callback) => {
      callback({ error: new Error('Axios error') });
    });

    await expect(adapter({})).rejects.toThrowError('Axios error');
  });
});
