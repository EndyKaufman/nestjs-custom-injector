import { Abstract, Injectable, Scope, Type } from '@nestjs/common';
import { DiscoveryService, ModulesContainer } from '@nestjs/core';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { InstanceToken } from '@nestjs/core/injector/module';
import {
  CustomInjectorError,
  CUSTOM_INJECTOR_METADATA,
  GetComponentsOptions,
  GetLastComponentOptions,
  GetProviderOptions,
  GetProvidersOptions,
  InjectedProvidersStorageItem,
  InjectedProvidersStorageItemOptions,
} from './custom-injector.types';
import { isPromise } from './custom-injector.utils';

@Injectable()
export class CustomInjectorService {
  public static _instance = new CustomInjectorService(
    new DiscoveryService(new ModulesContainer())
  );
  public static getInstance() {
    return CustomInjectorService._instance;
  }

  constructor(private readonly discoveryService: DiscoveryService) {
    CustomInjectorService._instance = this;
  }

  public getProvider<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>
  >(token: InstanceToken, options?: GetProviderOptions<T, E>): T {
    return this._getProvider<T, E>(token, options || {}, undefined);
  }

  public async getAsyncProvider<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>
  >(token: InstanceToken, options?: GetProviderOptions<T, E>): Promise<T> {
    return this._getAsyncProvider<T, E>(token, options || {}, undefined);
  }

  public getProviders<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>
  >(token: InstanceToken, options?: GetProvidersOptions<T, E>): T[] {
    return this._getProviders<T, E>(token, options || {}, undefined);
  }

  public async getAsyncProviders<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>
  >(token: InstanceToken, options?: GetProvidersOptions<T, E>): Promise<T[]> {
    return this._getAsyncProviders<T, E>(token, options || {}, undefined);
  }

  public createInjectedProvidersStorageItem<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>
  >(
    token: InstanceToken,
    target: unknown,
    options: InjectedProvidersStorageItemOptions<T, E>
  ) {
    return {
      appiled: false,
      instance: null,
      init: function () {
        this.options = {
          ...(this.options || {}),
          multi: Boolean(this.options.multi),
        };
        if (!this.options?.lazy && this.appiled) {
          return;
        }
        if (this.options?.multi) {
          this.instance = CustomInjectorService.getInstance()._getProviders(
            this.token,
            this.options,
            this
          );
        } else {
          this.instance = CustomInjectorService.getInstance()._getProvider(
            this.token,
            this.options,
            this
          );
        }
        this.appiled = true;
      },
      asyncInit: async function () {
        this.options = {
          ...(this.options || {}),
          multi: Boolean(this.options.multi),
        };
        if (!this.options?.lazy && this.appiled) {
          return;
        }
        if (this.options?.multi) {
          this.instance =
            await CustomInjectorService.getInstance()._getAsyncProviders(
              this.token,
              this.options,
              this
            );
        } else {
          this.instance =
            await CustomInjectorService.getInstance()._getAsyncProvider(
              this.token,
              this.options,
              this
            );
        }
        this.appiled = true;
      },
      target,
      token,
      options,
    } as InjectedProvidersStorageItem<T, E>;
  }

  async initAllNeedProviders() {
    const items = this.discoveryService
      .getProviders()
      .map((component) => this.toDiscoveredClass<object>(component))
      .filter(Boolean)
      .map((c) =>
        Reflect.getMetadataKeys(c)
          .filter((k) => k.indexOf(CUSTOM_INJECTOR_METADATA) === 0)
          .map((k) => Reflect.getMetadata(k, c))
      )
      .reduce((all, cur) => [...all, ...cur], []);
    for (let index = 0; index < items.length; index++) {
      if (!items[index]?.options?.lazy && items[index].asyncInit) {
        await items[index].asyncInit();
      }
    }
  }

  private _getProvider<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>
  >(
    token: InstanceToken,
    options: GetProviderOptions<T, E>,
    injectedProvidersStorageItem: InjectedProvidersStorageItem<T, E> | undefined
  ): T {
    const object = this.getOneProvider<T, E>(
      token,
      options,
      injectedProvidersStorageItem
    );
    if (Object.getOwnPropertyDescriptor(options || {}, 'propertyName')) {
      const propertyName = Object.getOwnPropertyDescriptor(
        options || {},
        'propertyName'
      )?.value;
      if (Object.getOwnPropertyDescriptor(object || {}, propertyName)) {
        const propertyObject = Object.getOwnPropertyDescriptor(
          object || {},
          propertyName
        )?.value;

        return propertyObject as T;
      }
      throw this.errorFactory<T>(
        token,
        injectedProvidersStorageItem,
        options?.errorFactory
      );
    }

    return object as T;
  }

  private async _getAsyncProvider<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>
  >(
    token: InstanceToken,
    options: GetProviderOptions<T, E>,
    injectedProvidersStorageItem: InjectedProvidersStorageItem<T, E> | undefined
  ): Promise<T> {
    let object = this.getOneProvider<T, E>(
      token,
      options,
      injectedProvidersStorageItem
    );
    if (Object.getOwnPropertyDescriptor(options || {}, 'propertyName')) {
      const propertyName = Object.getOwnPropertyDescriptor(
        options || {},
        'propertyName'
      )?.value;

      if (isPromise(object)) {
        object = await object;
      }

      if (Object.getOwnPropertyDescriptor(object || {}, propertyName)) {
        const propertyObject = Object.getOwnPropertyDescriptor(
          object || {},
          propertyName
        )?.value;

        if (isPromise(propertyObject)) {
          return await propertyObject;
        } else {
          return propertyObject as T;
        }
      }
      throw this.errorFactory(
        token,
        injectedProvidersStorageItem,
        options?.errorFactory
      );
    }

    if (isPromise(object)) {
      return await object;
    } else {
      return object as T;
    }
  }

  private getOneProvider<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>
  >(
    token: InstanceToken,
    options: GetProviderOptions<T, E>,
    injectedProvidersStorageItem: InjectedProvidersStorageItem<T, E> | undefined
  ) {
    return typeof token === 'string' ||
      typeof token === 'symbol' ||
      String(token).includes('Abstract') ||
      String(token).includes('abstract')
      ? this._getLastComponentByName<T, E, GetLastComponentOptions<T, E>>(
          token,
          options,
          injectedProvidersStorageItem
        )
      : this._getLastComponentsByClass<T, E, GetLastComponentOptions<T, E>>(
          token,
          options,
          injectedProvidersStorageItem
        );
  }

  private _getProviders<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>
  >(
    token: InstanceToken,
    options: GetProvidersOptions<T, E>,
    injectedProvidersStorageItem: InjectedProvidersStorageItem<T, E> | undefined
  ): T[] {
    const objects = this.getManyProviders<T, E>(
      token,
      options,
      injectedProvidersStorageItem
    );

    if (Object.getOwnPropertyDescriptor(options || {}, 'propertyName')) {
      const propertyName = Object.getOwnPropertyDescriptor(
        options || {},
        'propertyName'
      )?.value;
      const resolvedObjects: T[] = [];
      for (let index = 0; index < objects.length; index++) {
        resolvedObjects.push(objects[index]);
      }
      return resolvedObjects
        .filter((o) => Object.getOwnPropertyDescriptor(o || {}, propertyName))
        .map(
          (o) => Object.getOwnPropertyDescriptor(o || {}, propertyName)?.value
        ) as T[];
    }

    const resolvedObjects: T[] = [];
    for (let index = 0; index < objects.length; index++) {
      resolvedObjects.push(objects[index]);
    }
    return resolvedObjects;
  }

  private getManyProviders<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>
  >(
    token: InstanceToken,
    options: GetProvidersOptions<T, E>,
    injectedProvidersStorageItem: InjectedProvidersStorageItem<T, E> | undefined
  ) {
    return typeof token === 'string' ||
      typeof token === 'symbol' ||
      String(token).includes('Abstract') ||
      String(token).includes('abstract')
      ? this._getComponentsByName<T, E, GetProvidersOptions<T, E>>(
          token,
          options,
          injectedProvidersStorageItem
        )
      : this._getComponentsByClass<T, E, GetProvidersOptions<T, E>>(
          token,
          options,
          injectedProvidersStorageItem
        );
  }

  private async _getAsyncProviders<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>
  >(
    token: InstanceToken,
    options: GetProvidersOptions<T, E>,
    injectedProvidersStorageItem: InjectedProvidersStorageItem<T, E> | undefined
  ): Promise<T[]> {
    const objects = this.getManyProviders<T>(
      token,
      options,
      injectedProvidersStorageItem
    );

    if (Object.getOwnPropertyDescriptor(options || {}, 'propertyName')) {
      const propertyName = Object.getOwnPropertyDescriptor(
        options || {},
        'propertyName'
      )?.value;
      const resolvedObjects: T[] = [];
      for (let index = 0; index < objects.length; index++) {
        let object: T;
        if (isPromise(objects[index])) {
          object = await objects[index];
        } else {
          object = objects[index] as T;
        }
        resolvedObjects.push(object);
      }
      return resolvedObjects
        .filter((o) => Object.getOwnPropertyDescriptor(o || {}, propertyName))
        .map(
          (o) => Object.getOwnPropertyDescriptor(o || {}, propertyName)?.value
        ) as T[];
    }

    const resolvedObjects: T[] = [];
    for (let index = 0; index < objects.length; index++) {
      let object: T;
      if (isPromise(objects[index])) {
        object = await objects[index];
      } else {
        object = objects[index] as T;
      }
      resolvedObjects.push(object);
    }
    return resolvedObjects;
  }

  private _getLastComponentByName<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>,
    O extends GetLastComponentOptions<T, E> = GetLastComponentOptions<T, E>
  >(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    token: string | symbol | Abstract<any>,
    options: O,
    injectedProvidersStorageItem: InjectedProvidersStorageItem<T, E> | undefined
  ): T | Promise<T> {
    let components: T[];
    try {
      components = this._getComponentsByName<T, E, O>(
        token,
        options,
        injectedProvidersStorageItem
      );
    } catch (err) {
      components = [];
    }
    const defaultProviderValue = options?.defaultProviderValue;
    const component = components.length === 0 ? undefined : components[0];
    if (component === undefined) {
      if (defaultProviderValue === undefined) {
        throw this.errorFactory(
          token,
          injectedProvidersStorageItem,
          options?.errorFactory
        );
      }
      return defaultProviderValue;
    }

    return component;
  }

  private _getLastComponentsByClass<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>,
    O extends GetLastComponentOptions<T, E> = GetLastComponentOptions<T, E>
  >(
    // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
    token: Type<any> | Function,
    options: O,
    injectedProvidersStorageItem: InjectedProvidersStorageItem<T, E> | undefined
  ): T | Promise<T> {
    let components: T[];
    try {
      components = this._getComponentsByClass<T, E, O>(
        token,
        options,
        injectedProvidersStorageItem
      );
    } catch (err) {
      components = [];
    }
    const defaultProviderValue = options?.defaultProviderValue;
    const component = components.length === 0 ? undefined : components[0];

    if (component === undefined) {
      if (defaultProviderValue === undefined) {
        throw this.errorFactory(
          token,
          injectedProvidersStorageItem,
          options?.errorFactory
        );
      }
      return defaultProviderValue;
    }

    return component;
  }

  private _getComponentsByName<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>,
    O extends GetComponentsOptions<T, E> = GetComponentsOptions<T, E>
  >(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    token: string | symbol | Abstract<any>,
    options: O,
    injectedProvidersStorageItem: InjectedProvidersStorageItem<T, E> | undefined
  ): T[] {
    if (!this.discoveryService) {
      throw new CustomInjectorError(`this.discoveryService not set`);
    }

    let values = this.discoveryService
      .getProviders()
      .filter(
        (component) =>
          component.scope !== Scope.REQUEST &&
          (component.name === token || component.token === token)
      )
      .map((component) => this.toDiscoveredClass<T>(component))
      .map((component) =>
        options?.providerFactory
          ? options?.providerFactory(component)
          : component
      );
    if (
      values.length === 0 &&
      !Object.getOwnPropertyDescriptor(options, 'providersFactory') &&
      !Object.getOwnPropertyDescriptor(options, 'defaultProvidersValue')
    ) {
      throw this.errorFactory<T>(
        token,
        injectedProvidersStorageItem,
        options?.errorFactory
      );
    }

    if (options?.providersFactory) {
      values = options.providersFactory(values);
    }
    if (options?.defaultProvidersValue) {
      values = options.defaultProvidersValue;
    }
    return values as T[];
  }

  private _getComponentsByClass<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>,
    O extends GetComponentsOptions<T, E> = GetComponentsOptions<T, E>
  >(
    // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
    cls: Type<any> | Abstract<any> | Function,
    options: O,
    injectedProvidersStorageItem: InjectedProvidersStorageItem<T, E> | undefined
  ): T[] {
    if (!this.discoveryService) {
      throw new CustomInjectorError(`this.discoveryService not set`);
    }

    let values = this.discoveryService
      .getProviders()
      .filter((component) => component.scope !== Scope.REQUEST)
      .map((component) => this.toDiscoveredClass<T>(component))
      .filter((obj) => {
        try {
          return obj && obj instanceof cls;
        } catch (err) {
          return false;
        }
      })
      .map((component) =>
        options?.providerFactory
          ? options?.providerFactory(component)
          : component
      );

    if (
      values.length === 0 &&
      !Object.getOwnPropertyDescriptor(options, 'providersFactory') &&
      !Object.getOwnPropertyDescriptor(options, 'defaultProvidersValue')
    ) {
      throw this.errorFactory(
        cls,
        injectedProvidersStorageItem,
        options?.errorFactory
      );
    }

    if (options?.providersFactory) {
      values = options.providersFactory(values);
    }
    if (options?.defaultProvidersValue) {
      values = options.defaultProvidersValue;
    }
    return values as T[];
  }

  private errorFactory<
    T,
    E extends CustomInjectorError<T> = CustomInjectorError<T>
  >(
    token: InstanceToken,
    injectedProvidersStorageItem?: InjectedProvidersStorageItem<T, E>,
    errorFactory?: (
      message: string,
      injectedProvidersStorageItem?: InjectedProvidersStorageItem<T, E>
    ) => E
  ): E {
    return errorFactory
      ? errorFactory(
          `${
            injectedProvidersStorageItem?.options?.multi
              ? 'Providers'
              : 'Provider'
          } "${token.toString()}" not found!`,
          injectedProvidersStorageItem
        )
      : (new CustomInjectorError<T>(
          `${
            injectedProvidersStorageItem?.options?.multi
              ? 'Providers'
              : 'Provider'
          } "${token.toString()}" not found!`,
          injectedProvidersStorageItem
        ) as E);
  }

  private toDiscoveredClass<T>(wrapper: InstanceWrapper): T {
    const instanceHost: {
      instance: T;
    } = wrapper.getInstanceByContextId(
      STATIC_CONTEXT,
      wrapper && wrapper.id ? wrapper.id : undefined
    );
    return instanceHost.instance;
  }
}
