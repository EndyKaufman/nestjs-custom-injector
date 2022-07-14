import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  CustomInject,
  CustomInjectorError,
  CustomInjectorModule,
} from '../src';

describe('Multi providers (unit)', () => {
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
      @CustomInject<CProvider>(C_PROVIDER, { multi: true })
      providers!: CProvider[];
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
    expect(p.providers.map((o) => o.type)).toEqual(['c1', 'c2']);
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
      @CustomInject<CProvider>(C_PROVIDER, { multi: true })
      providers!: CProvider[];
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
    expect(p.providers.map((o) => o.type)).toEqual(['c1', 'c2']);
    await app.close();
  });

  it('Error if array of providers not set', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER1 = 'C_PROVIDER1';
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER1, { multi: true })
      providers!: CProvider;
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
        errorFactory: (message: string) => new CustomError(message),
      })
      providers!: CProvider;
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
        providerFactory: (data) => ({ type: data.name }),
      })
      providers!: CProvider[];
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
    expect(p.providers.map((o) => o.type)).toEqual(['c1', 'c2']);
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
        providerFactory: (data) =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ type: data.name }), 1000)
          ),
      })
      providers!: CProvider[];
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
    expect(p.providers.map((o) => o.type)).toEqual(['c1', 'c2']);
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
      @CustomInject<CProvider>(C_PROVIDER, { multi: true, lazy: true })
      providers!: CProvider[];
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
    expect(p.providers.map((o) => o.type)).toEqual(['c1', 'c2']);
    await app.close();
  });

  it('Update multi providers on runtime', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER_NEW = Symbol('C_PROVIDER_NEW');
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
      @CustomInject<CProvider>(C_PROVIDER_NEW, { multi: true })
      providers!: CProvider[];
    }
    const module = await Test.createTestingModule({
      imports: [
        CustomInjectorModule.forRoot(),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER_NEW, useValue: new C1() }],
        }),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER_NEW, useClass: C2 }],
        }),
      ],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const p = app.get<P>(P);
    expect(p.providers.map((o) => o.type)).toEqual(['c1', 'c2']);
    p.providers.forEach((o) => {
      o.type = `updated ${o.type}`;
    });
    const p2 = app.get<P>(P);
    expect(p2.providers.map((o) => o.type)).toEqual([
      'updated c1',
      'updated c2',
    ]);
    await app.close();
  });

  it('Update multi providers created with factory on runtime', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER_NEW = Symbol('C_PROVIDER_NEW');
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
      @CustomInject<CProvider>(C_PROVIDER_NEW, {
        multi: true,
        providerFactory: (data) => ({ ...data, type: `factory ${data.type}` }),
      })
      providers!: CProvider[];
    }
    const module = await Test.createTestingModule({
      imports: [
        CustomInjectorModule.forRoot(),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER_NEW, useValue: new C1() }],
        }),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER_NEW, useClass: C2 }],
        }),
      ],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const providers = app.get<P>(P).providers;
    expect(providers.map((o) => o.type)).toEqual(['factory c1', 'factory c2']);
    providers.forEach((o) => {
      o.type = `updated ${o.type}`;
    });
    const currentProviders = [...app.get<P>(P).providers];
    expect(currentProviders.map((o) => o.type)).toEqual([
      'updated factory c1',
      'updated factory c2',
    ]);
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
        defaultProvidersValue: [],
      })
      providers!: CProvider[];
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
