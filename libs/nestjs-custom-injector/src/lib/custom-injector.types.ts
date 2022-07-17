import { InstanceToken } from '@nestjs/core/injector/module';

export const CUSTOM_INJECTOR_METADATA = 'custom-injector:metadata';

export type InjectedProvidersStorageItemOptions<
  T,
  E extends CustomInjectorError<T> = CustomInjectorError<T>
> =
  | (GetProvidersOptions<T, E> & {
      lazy?: boolean;
      multi: true;
    })
  | (GetProviderOptions<T, E> & {
      lazy?: boolean;
      multi?: false;
    });

export type InjectedProvidersStorageItem<
  T = unknown,
  E extends CustomInjectorError<T> = CustomInjectorError<T>
> = {
  target: object;
  token: InstanceToken;
  options?: InjectedProvidersStorageItemOptions<T, E>;
  instance: null | T | T[];
  appiled: boolean;
  init: () => void;
  asyncInit: () => Promise<void>;
};

export class CustomInjectorError<T = unknown> extends Error {
  constructor(
    public override message: string,
    public injectedProvidersStorageItem?: InjectedProvidersStorageItem<T>
  ) {
    super(message);
  }
}

export interface GetComponentsOptions<T, E extends CustomInjectorError<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providerFactory?: (value: any) => T | Promise<T>;
  defaultProvidersValue?: T[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providersFactory?: (value: any) => T[];
  errorFactory?: (
    message: string,
    injectedProvidersStorageItem?: InjectedProvidersStorageItem<T, E>
  ) => E;
}

export interface GetLastComponentOptions<T, E extends CustomInjectorError<T>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  providerFactory?: (value: any) => T | Promise<T>;
  defaultProviderValue?: T | Promise<T>;
  errorFactory?: (
    message: string,
    injectedProvidersStorageItem?: InjectedProvidersStorageItem<T, E>
  ) => E;
}

export type GetProvidersOptions<
  T,
  E extends CustomInjectorError<T>
> = GetComponentsOptions<T, E> & {
  propertyName?: keyof T;
};

export type GetProviderOptions<
  T,
  E extends CustomInjectorError<T>
> = GetLastComponentOptions<T, E> & {
  propertyName?: keyof T;
};
