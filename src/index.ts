import { adapter } from './adapter';
import { registerMessageHandler } from './registerMessageHandler';
import { AxiosChromeMessagingAdapter } from './types';

const adapterWithRegister = (adapter as AxiosChromeMessagingAdapter);
adapterWithRegister.registerMessageHandler = registerMessageHandler;

// tslint:disable-next-line:no-default-export
export default adapterWithRegister;
