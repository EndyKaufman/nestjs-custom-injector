import { Injectable, Scope } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core';
import { STATIC_CONTEXT } from '@nestjs/core/injector/constants';
import { InstanceWrapper } from '@nestjs/core/injector/instance-wrapper';
import { InstanceToken, Module } from '@nestjs/core/injector/module';

@Injectable()
export class CustomInjectorService {
  public static instance: CustomInjectorService;

  constructor(private readonly modulesContainer: ModulesContainer) {
    CustomInjectorService.instance = this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getProviders<D = any>(
    token: InstanceToken,
    options?: {
      static?: boolean;
      multi?: boolean;
      propertyName?: string;
      defaultPropertyValue?: D;
    }
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let value: any;
    if (typeof token === 'string' || typeof token === 'symbol') {
      value = options?.multi
        ? CustomInjectorService.instance.getComponentsByName(token)
        : CustomInjectorService.instance.getLastComponentByName(token);
    } else {
      value = options?.multi
        ? CustomInjectorService.instance.getComponentsByClass(token)
        : CustomInjectorService.instance.getLastComponentsByClass(token);
    }
    if (options?.propertyName) {
      if (options.multi) {
        value = value.map((item) => {
          try {
            if (
              options.propertyName &&
              Object.getOwnPropertyDescriptor(item, options.propertyName)
            ) {
              item = item[options.propertyName];
            } else {
              item = options.defaultPropertyValue;
            }
          } catch (err) {
            item = options.defaultPropertyValue;
            console.error(err);
          }
          return item;
        });
      } else {
        try {
          if (
            options.propertyName &&
            Object.getOwnPropertyDescriptor(value, options.propertyName)
          ) {
            value = value[options.propertyName];
          } else {
            value = options.defaultPropertyValue;
          }
        } catch (err) {
          value = options.defaultPropertyValue;
          console.error(err);
        }
      }
    }
    return value;
  }
  public getLastComponentByName<T>(token: InstanceToken): T | null {
    const values = this.getComponentsByName<T>(token);
    if (values.length > 0) {
      return values[0];
    }

    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getLastComponentsByClass<T>(cls: any): T | null {
    const objects = this.getComponentsByClass<T>(cls);
    if (objects.length > 0) {
      return objects[0];
    }

    return null;
  }

  public getComponentsByName<T>(token: InstanceToken): T[] {
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
      .filter(Boolean);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getComponentsByClass<T>(cls: any): T[] {
    const modulesMap = [...this.modulesContainer.entries()];

    return modulesMap
      .map(([, nestModule]: [string, Module]) => {
        const components = [...nestModule.providers.values()];

        return components
          .filter((component) => component.scope !== Scope.REQUEST)
          .map((component) => this.toDiscoveredClass<T>(nestModule, component))
          .filter((obj) => obj instanceof cls);
      })
      .reduce((all, cur) => all.concat(cur), [])
      .filter(Boolean);
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
