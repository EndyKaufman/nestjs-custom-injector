import { InstanceToken } from '@nestjs/core/injector/module';
import { CustomInjectorService } from './custom-injector.service';
import { getCustomInjectorStorage } from './custom-injector.storage';
import {
  CustomInjectorError,
  InjectedProvidersStorageItemOptions,
} from './custom-injector.types';

export function CustomInjector() {
  return function (target: unknown, propertyKey: string) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return CustomInjectorService.getInstance();
      },
    });
  };
}

export function CustomInject<
  T,
  E extends CustomInjectorError<T> = CustomInjectorError<T>
>(token: InstanceToken, options?: InjectedProvidersStorageItemOptions<T, E>) {
  return function (target: unknown, propertyKey: string) {
    let injectedProvidersStorageItem = getCustomInjectorStorage<T, E>().find(
      (item) => item.target === target && item.token === token
    );
    if (injectedProvidersStorageItem === undefined) {
      injectedProvidersStorageItem =
        CustomInjectorService.getInstance().createInjectedProvidersStorageItem<
          T,
          E
        >(token, target, options || {});
      getCustomInjectorStorage<T, E>().push(injectedProvidersStorageItem);
    }
    Object.defineProperty(target, propertyKey, {
      get: function () {
        if (!injectedProvidersStorageItem) {
          throw new CustomInjectorError('injectedProvidersStorageItem not set');
        }
        if (options?.lazy) {
          injectedProvidersStorageItem.init();
        }
        return injectedProvidersStorageItem.instance;
      },
    });
  };
}
