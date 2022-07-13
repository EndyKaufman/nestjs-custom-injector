import { InjectedProvidersStorageItemType } from './custom-injector.types';

let injectedProvidersStorage: InjectedProvidersStorageItemType[] = [];

export function getCustomInjectorStorage() {
  return injectedProvidersStorage;
}

export function setCustomInjectorStorage(
  data: typeof injectedProvidersStorage
) {
  injectedProvidersStorage = data;
}
