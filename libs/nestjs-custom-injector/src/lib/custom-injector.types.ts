import { InstanceToken } from '@nestjs/core/injector/module';

export type InjectedProvidersStorageItemType = {
  target: unknown;
  token: InstanceToken;
  options?: (
    | GetProvidersOptions<unknown>
    | GetProviderOptions<unknown, CustomInjectorError>
  ) & {
    lazy?: boolean;
  };
  instance: unknown | unknown[];
  appiled: boolean;
  init: () => unknown | unknown[];
  asyncInit: () => Promise<unknown> | Promise<unknown[]>;
};

export class CustomInjectorError extends Error {
  constructor(
    public override message: string,
    public injectedProvidersStorageItem?: InjectedProvidersStorageItemType
  ) {
    super(message);
  }
}

export interface GetComponentsOptions<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factory?: (value: any) => T | Promise<T>;
}

export interface GetLastComponentOptions<T, E> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  factory?: (value: any) => T | Promise<T>;
  defaultValue?: T | Promise<T> | undefined;
  error?: E | undefined;
}

export type GetProvidersOptions<T> = GetComponentsOptions<T> & {
  propertyName?: string;
};

export type GetProviderOptions<T, E> = GetLastComponentOptions<T, E> & {
  propertyName?: string;
};
