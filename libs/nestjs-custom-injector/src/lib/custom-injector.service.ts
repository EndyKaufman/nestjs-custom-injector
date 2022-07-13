import { Abstract, Injectable, Scope, Type } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { InstanceToken, Module } from '@nestjs/core/injector/module';
import { getCustomInjectorStorage } from './custom-injector.storage';
import {
  CustomInjectorError,
  GetComponentsOptions,
  GetLastComponentOptions,
  GetProviderOptions,
  GetProvidersOptions,
  InjectedProvidersStorageItemType,
} from './custom-injector.types';

@Injectable()
export class CustomInjectorService {
  public static instance: CustomInjectorService;

  constructor(private readonly modulesContainer: ModulesContainer) {
    CustomInjectorService.instance = this;
  }

  public async initAllProviders() {
    const items = getCustomInjectorStorage();
    for (let index = 0; index < items.length; index++) {
      if (!items[index].options?.lazy) {
        await items[index].asyncInit();
      }
    }
  }

  public getProvider<T, E extends CustomInjectorError = CustomInjectorError>(
    token: InstanceToken,
    options?: GetProviderOptions<T, E>,
    injectedProvidersStorageItem?: InjectedProvidersStorageItemType
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
      if (options?.error) {
        throw this.errorFactory(token, injectedProvidersStorageItem);
      }
    }

    return object as T;
  }

  public async getAsyncProvider<
    T,
    E extends CustomInjectorError = CustomInjectorError
  >(
    token: InstanceToken,
    options?: GetProviderOptions<T, E>,
    injectedProvidersStorageItem?: InjectedProvidersStorageItemType
  ): Promise<T> {
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

        if (
          Object.prototype.toString.call(propertyObject) === '[object Promise]'
        ) {
          return await propertyObject;
        } else {
          return propertyObject as T;
        }
      }
      if (options?.error) {
        throw this.errorFactory(token, injectedProvidersStorageItem);
      }
    }

    if (Object.prototype.toString.call(object) === '[object Promise]') {
      return await object;
    } else {
      return object as T;
    }
  }

  private getOneProvider<
    T,
    E extends CustomInjectorError = CustomInjectorError
  >(
    token: InstanceToken,
    options: GetProviderOptions<T, E> | undefined,
    injectedProvidersStorageItem: InjectedProvidersStorageItemType | undefined
  ) {
    return typeof token === 'string' || typeof token === 'symbol'
      ? this.getLastComponentByName<T, E, GetLastComponentOptions<T, E>>(
          token,
          options,
          injectedProvidersStorageItem
        )
      : this.getLastComponentsByClass<T, E, GetLastComponentOptions<T, E>>(
          token,
          options,
          injectedProvidersStorageItem
        );
  }

  public getProviders<T>(
    token: InstanceToken,
    options?: GetProvidersOptions<T>
  ): T[] {
    const objects = this.getManyProviders<T>(token, options);

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

  private getManyProviders<T>(
    token: InstanceToken,
    options: GetProvidersOptions<T> | undefined
  ) {
    return typeof token === 'string' || typeof token === 'symbol'
      ? this.getComponentsByName<T, GetProvidersOptions<T>>(token, options)
      : this.getComponentsByClass<
          T,
          T extends object
            ? GetComponentsOptions<T>
            : GetComponentsOptions<T> & {
                propertyName: string;
              }
        >(token);
  }

  public async getAsyncProviders<T>(
    token: InstanceToken,
    options?: GetProvidersOptions<T>
  ): Promise<T[]> {
    const objects = this.getManyProviders<T>(token, options);

    if (Object.getOwnPropertyDescriptor(options || {}, 'propertyName')) {
      const propertyName = Object.getOwnPropertyDescriptor(
        options || {},
        'propertyName'
      )?.value;
      const resolvedObjects: T[] = [];
      for (let index = 0; index < objects.length; index++) {
        let object: T;
        if (
          Object.prototype.toString.call(objects[index]) === '[object Promise]'
        ) {
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
      if (
        Object.prototype.toString.call(objects[index]) === '[object Promise]'
      ) {
        object = await objects[index];
      } else {
        object = objects[index] as T;
      }
      resolvedObjects.push(object);
    }
    return resolvedObjects;
  }

  public getLastComponentByName<
    T,
    E extends CustomInjectorError = CustomInjectorError,
    O extends GetLastComponentOptions<T, E> = GetLastComponentOptions<T, E>
  >(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    token: string | symbol | Abstract<any>,
    options?: O,
    injectedProvidersStorageItem?: InjectedProvidersStorageItemType
  ): T | Promise<T> {
    const components = this.getComponentsByName<T, O>(token, options);
    const defaultValue = options?.defaultValue;
    const component = components.length === 0 ? undefined : components[0];

    if (component === undefined) {
      if (defaultValue === undefined) {
        throw (
          options?.error ||
          this.errorFactory(token, injectedProvidersStorageItem)
        );
      }
      return defaultValue;
    }

    return component;
  }

  public getLastComponentsByClass<
    T,
    E extends CustomInjectorError = CustomInjectorError,
    O extends GetLastComponentOptions<T, E> = GetLastComponentOptions<T, E>
  >(
    // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
    token: Type<any> | Function,
    options?: O,
    injectedProvidersStorageItem?: InjectedProvidersStorageItemType
  ): T | Promise<T> {
    const components = this.getComponentsByClass<T, O>(token, options);
    const defaultValue = options?.defaultValue;
    const component = components.length === 0 ? undefined : components[0];

    if (component === undefined) {
      if (defaultValue === undefined) {
        throw (
          options?.error ||
          this.errorFactory(token, injectedProvidersStorageItem)
        );
      }
      return defaultValue;
    }

    return component;
  }

  public getComponentsByName<
    T,
    O extends GetComponentsOptions<T> = GetComponentsOptions<T>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >(token: string | symbol | Abstract<any>, options?: O): T[] {
    const modulesMap = [...this.modulesContainer.entries()];

    return modulesMap
      .map(([, nestModule]: [string, Module]) => {
        const components = [...nestModule.providers.values()];
        return components
          .filter(
            (component) =>
              component.scope !== Scope.REQUEST &&
              (component.name === token || component.token === token)
          )
          .map((component) => this.toDiscoveredClass<T>(nestModule, component));
      })
      .reduce((all, cur) => all.concat(cur), [])
      .map((component) =>
        options?.factory ? options?.factory(component) : component
      ) as T[];
  }

  public getComponentsByClass<
    T,
    O extends GetComponentsOptions<T> = GetComponentsOptions<T>
  >(
    // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
    cls: Type<any> | Abstract<any> | Function,
    options?: O
  ): T[] {
    const modulesMap = [...this.modulesContainer.entries()];

    return modulesMap
      .map(([, nestModule]: [string, Module]) => {
        const components = [...nestModule.providers.values()];

        return components
          .filter((component) => component.scope !== Scope.REQUEST)
          .map((component) => this.toDiscoveredClass<T>(nestModule, component))
          .filter((obj) => {
            try {
              return obj && obj instanceof cls;
            } catch (err) {
              return false;
            }
          });
      })
      .reduce((all, cur) => all.concat(cur), [])
      .map((component) =>
        options?.factory ? options?.factory(component) : component
      ) as T[];
  }

  private errorFactory(
    token: InstanceToken,
    injectedProvidersStorageItem?: InjectedProvidersStorageItemType
  ): CustomInjectorError | undefined {
    return new CustomInjectorError(
      `Provider "${token.toString()}" not found!`,
      injectedProvidersStorageItem
    );
  }

  private toDiscoveredClass<T>(
    nestModule: Module,
    wrapper: InstanceWrapper
  ): T {
    const instanceHost: {
      instance: T;
    } = wrapper.getInstanceByContextId(
      STATIC_CONTEXT,
      wrapper && wrapper.id ? wrapper.id : undefined
    );
    return instanceHost.instance;
  }
}
