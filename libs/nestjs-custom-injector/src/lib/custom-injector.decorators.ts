import { InstanceToken } from '@nestjs/core/injector/module';
import { CustomInjectorService } from './custom-injector.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const injectedProviders: Record<any, Record<any, any[]> | any> = {};
export function CustomInjector() {
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey: string
  ) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        return CustomInjectorService.instance;
      },
    });
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function CustomInject<D = any>(
  token: InstanceToken,
  options?: {
    static?: boolean;
    multi?: boolean;
    propertyName?: string;
    defaultPropertyValue?: D;
  }
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tookenKey = token as any;
  return function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    propertyKey: string
  ) {
    Object.defineProperty(target, propertyKey, {
      get: function () {
        if (!injectedProviders[target]) {
          injectedProviders[target] = {};
        }
        if (!injectedProviders[target]?.[tookenKey] || !options?.static) {
          injectedProviders[target][tookenKey] =
            CustomInjectorService.instance.getProviders(token, options);
        }
        return injectedProviders[target][tookenKey];
      },
    });
  };
}
