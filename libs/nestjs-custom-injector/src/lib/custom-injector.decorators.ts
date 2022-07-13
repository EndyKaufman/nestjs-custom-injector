import { InstanceToken } from '@nestjs/core/injector/module';
import { CustomInjectorService } from './custom-injector.service';
import { getCustomInjectorStorage } from './custom-injector.storage';
import {
  CustomInjectorError,
  GetProviderOptions,
  GetProvidersOptions,
  InjectedProvidersStorageItemType,
} from './custom-injector.types';

export function CustomInjector() {
  return function (target: unknown, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return CustomInjectorService.instance;
      },
    });
  };
}

export function CustomInject<
  T,
  E extends CustomInjectorError = CustomInjectorError
>(
  token: InstanceToken,
  options?:
    | (GetProvidersOptions<T> & {
        lazy?: boolean;
        multi: true;
      })
    | (GetProviderOptions<T, E> & {
        lazy?: boolean;
      })
) {
  return function (target: unknown, propertyKey: string) {
    let index = getCustomInjectorStorage().findIndex(
      (item) => item.target === target && item.token === token
    );
    let injectedProvidersStorageItem: InjectedProvidersStorageItemType;
    if (index === -1) {
      injectedProvidersStorageItem = {
        appiled: false,
        instance: null,
        init: function () {
          if (this.options?.multi) {
            this.instance = CustomInjectorService.instance.getProviders(
              this.token,
              this.options
            );
          } else {
            this.instance = CustomInjectorService.instance.getProvider(
              this.token,
              this.options,
              this
            );
          }
        },
        asyncInit: async function () {
          if (this.options?.multi) {
            this.instance =
              await CustomInjectorService.instance.getAsyncProviders(
                this.token,
                this.options
              );
          } else {
            this.instance =
              await CustomInjectorService.instance.getAsyncProvider(
                this.token,
                this.options,
                this
              );
          }
        },
        target,
        token,
        options,
      };
      getCustomInjectorStorage().push(injectedProvidersStorageItem);
      index = getCustomInjectorStorage().length;
    } else {
      injectedProvidersStorageItem = getCustomInjectorStorage()[index];
    }
    Object.defineProperty(target, propertyKey, {
      get: function () {
        if (options?.lazy) {
          injectedProvidersStorageItem.init();
        }
        return injectedProvidersStorageItem.instance;
      },
    });
  };
}
