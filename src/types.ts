import { AxiosRequestConfig, AxiosResponse } from 'axios';

export const unsupportedAxiosOptions = [
  'paramsSerializer',
  'onUploadProgress',
  'onDownloadProgress',
  'cancelToken',
  'transformRequest',
  'transformResponse'
] as const;

export type AxiosMessagingAdapterConfig = Omit<
  AxiosRequestConfig,
  typeof unsupportedAxiosOptions[number]
>;

export type AxiosMessagingAdapterRequest = {
  name: 'axiosMessagingAdapterRequest';
  axiosConfig: AxiosMessagingAdapterConfig;
};

export type AxiosMessagingAdapterResponse = {
  error?: any;
  response?: AxiosResponse;
};
