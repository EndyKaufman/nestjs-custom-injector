import {
  CustomInjectorError,
  InjectedProvidersStorageItem,
} from './custom-injector.types';

let injectedProvidersStorage: InjectedProvidersStorageItem[] = [];

export function getCustomInjectorStorage<
  T,
  E extends CustomInjectorError<T> = CustomInjectorError<T>
>() {
  return injectedProvidersStorage as InjectedProvidersStorageItem<T, E>[];
}

export function setCustomInjectorStorage<
  T,
  E extends CustomInjectorError<T> = CustomInjectorError<T>
>(data: InjectedProvidersStorageItem<T, E>[]) {
  injectedProvidersStorage = data as InjectedProvidersStorageItem[];
}

export async function initAllProviders() {
  const items = getCustomInjectorStorage();
  for (let index = 0; index < items.length; index++) {
    if (!items[index].options?.lazy) {
      await items[index].asyncInit();
    }
  }
}
