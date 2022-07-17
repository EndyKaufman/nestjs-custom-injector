import { InstanceToken } from '@nestjs/core/injector/module';
import { CustomInjectorService } from './custom-injector.service';
import {
  CustomInjectorError,
  CUSTOM_INJECTOR_METADATA,
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
  return function (target: object, propertyKey: string) {
    let injectedProvidersStorageItem = Reflect.getMetadata(
      `${CUSTOM_INJECTOR_METADATA}_${propertyKey}`,
      target
    );
    if (injectedProvidersStorageItem === undefined) {
      injectedProvidersStorageItem =
        CustomInjectorService.getInstance().createInjectedProvidersStorageItem<
          T,
          E
        >(token, target, options || {});
    }
    Reflect.defineMetadata(
      `${CUSTOM_INJECTOR_METADATA}_${propertyKey}`,
      injectedProvidersStorageItem,
      target
    );
    Object.defineProperty(target, propertyKey, {
      get: function () {
        if (!injectedProvidersStorageItem) {
          throw new CustomInjectorError('injectedProvidersStorageItem not set');
        }
        if (options?.lazy || !injectedProvidersStorageItem.appiled) {
          injectedProvidersStorageItem.init();
        }
        return injectedProvidersStorageItem.instance;
      },
    });
  };
}
