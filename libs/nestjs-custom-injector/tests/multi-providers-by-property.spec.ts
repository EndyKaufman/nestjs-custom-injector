import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  CustomInject,
  CustomInjectorError,
  CustomInjectorModule,
} from '../src';

describe('Multi providers by property (unit)', () => {
  jest.setTimeout(60 * 1000);

  it('Work with multi providers', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER = Symbol('C_PROVIDER');
    @Injectable()
    class C1 implements CProvider {
      type = 'c1';
    }
    @Injectable()
    class C2 implements CProvider {
      type = 'c2';
    }
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER, {
        multi: true,
        propertyName: 'type',
      })
      providers!: CProvider['type'][];
    }
    const module = await Test.createTestingModule({
      imports: [
        CustomInjectorModule.forRoot(),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER, useClass: C1 }],
        }),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER, useClass: C2 }],
        }),
      ],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const p = app.get<P>(P);
    expect(p.providers).toEqual(['c1', 'c2']);
    await app.close();
  });

  it('Work with multi regular and async providers', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER = Symbol('C_PROVIDER');
    @Injectable()
    class C1 implements CProvider {
      type = 'c1';
    }
    @Injectable()
    class C2 implements CProvider {
      type = 'c2';
    }
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER, {
        multi: true,
        propertyName: 'type',
      })
      providers!: CProvider['type'][];
    }
    const module = await Test.createTestingModule({
      imports: [
        CustomInjectorModule.forRoot(),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER, useClass: C1 }],
        }),
        CustomInjectorModule.forFeature({
          providers: [
            {
              provide: C_PROVIDER,
              useFactory: () =>
                new Promise((resolve) =>
                  setTimeout(() => resolve(new C2()), 1000)
                ),
            },
          ],
        }),
      ],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const p = app.get<P>(P);
    expect(p.providers).toEqual(['c1', 'c2']);
    await app.close();
  });

  it('Error if array of providers not set', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER1 = 'C_PROVIDER1';
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER1, {
        multi: true,
        propertyName: 'type',
      })
      providers!: CProvider['type'];
    }
    const module = await Test.createTestingModule({
      imports: [CustomInjectorModule.forRoot()],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    try {
      await app.init();
      expect(true).toEqual(false);
    } catch (err) {
      expect(err instanceof CustomInjectorError && err.message).toEqual(
        `Providers "C_PROVIDER1" not found!`
      );
      expect(
        err instanceof CustomInjectorError &&
          err.injectedProvidersStorageItem?.token
      ).toEqual(C_PROVIDER1);
    }
    await app.close();
  });

  it('Custom error if array of providers not set', async () => {
    interface CProvider {
      type: string;
    }
    class CustomError extends CustomInjectorError<CProvider> {
      constructor(public override message: string) {
        super(message);
      }
    }
    const C_PROVIDER1 = 'C_PROVIDER1';
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER1, {
        multi: true,
        propertyName: 'type',
        errorFactory: (message: string) => new CustomError(message),
      })
      providers!: CProvider['type'];
    }
    const module = await Test.createTestingModule({
      imports: [CustomInjectorModule.forRoot()],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    try {
      await app.init();
      expect(true).toEqual(false);
    } catch (err) {
      expect(err instanceof CustomError && err.message).toEqual(
        `Providers "C_PROVIDER1" not found!`
      );
      expect(
        err instanceof CustomError && err.injectedProvidersStorageItem?.token
      ).toEqual(undefined);
    }
    await app.close();
  });

  it('Create multi providers with factory', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER = Symbol('C_PROVIDER');
    @Injectable()
    class C1 {
      name = 'c1';
    }
    @Injectable()
    class C2 {
      name = 'c2';
    }
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER, {
        multi: true,
        propertyName: 'type',
        providerFactory: (data) => ({ type: data.name }),
      })
      providers!: CProvider['type'][];
    }
    const module = await Test.createTestingModule({
      imports: [
        CustomInjectorModule.forRoot(),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER, useClass: C1 }],
        }),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER, useClass: C2 }],
        }),
      ],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const p = app.get<P>(P);
    expect(p.providers).toEqual(['c1', 'c2']);
    await app.close();
  });

  it('Create multi providers with async factory', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER = Symbol('C_PROVIDER');
    @Injectable()
    class C1 {
      name = 'c1';
    }
    @Injectable()
    class C2 {
      name = 'c2';
    }
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER, {
        multi: true,
        propertyName: 'type',
        providerFactory: (data) =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ type: data.name }), 1000)
          ),
      })
      providers!: CProvider['type'][];
    }
    const module = await Test.createTestingModule({
      imports: [
        CustomInjectorModule.forRoot(),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER, useClass: C1 }],
        }),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER, useClass: C2 }],
        }),
      ],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const p = app.get<P>(P);
    expect(p.providers).toEqual(['c1', 'c2']);
    await app.close();
  });

  it('Load multi providers with lazy option on getting data, without set them from application bootstrap', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER = Symbol('C_PROVIDER');
    @Injectable()
    class C1 implements CProvider {
      type = 'c1';
    }
    @Injectable()
    class C2 implements CProvider {
      type = 'c2';
    }
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER, {
        multi: true,
        propertyName: 'type',
        lazy: true,
      })
      providers!: CProvider['type'][];
    }
    const module = await Test.createTestingModule({
      imports: [
        CustomInjectorModule.forRoot(),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER, useClass: C1 }],
        }),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER, useClass: C2 }],
        }),
      ],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    // we don't need start application, because providers marked with lazy options will be ignored when the application bootstrap
    // await app.init();
    const p = app.get<P>(P);
    expect(p.providers).toEqual(['c1', 'c2']);
    await app.close();
  });

  it('Use default providers if providers for token not found', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER = Symbol('C_PROVIDER');
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER, {
        multi: true,
        propertyName: 'type',
        defaultProvidersValue: [],
      })
      providers!: CProvider['type'][];
    }
    const module = await Test.createTestingModule({
      imports: [CustomInjectorModule.forRoot()],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const providers = app.get<P>(P).providers;
    expect(providers).toEqual([]);
    await app.close();
  });
});
