import { Injectable } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import {
  CustomInject,
  CustomInjectorError,
  CustomInjectorModule,
} from '../src';

describe('One provider (unit)', () => {
  jest.setTimeout(60 * 1000);

  it('Work with one provider', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER = Symbol('C_PROVIDER');
    @Injectable()
    class C1 implements CProvider {
      type = 'c1';
    }
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER)
      provider!: CProvider;
    }
    const module = await Test.createTestingModule({
      imports: [
        CustomInjectorModule.forRoot(),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER, useClass: C1 }],
        }),
      ],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const p = app.get<P>(P);
    expect(p.provider.type).toEqual('c1');
    await app.close();
  });

  it('Error if provider not set', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER1 = 'C_PROVIDER1';
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER1)
      provider!: CProvider;
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
        `Provider "C_PROVIDER1" not found!`
      );
      expect(
        err instanceof CustomInjectorError &&
          err.injectedProvidersStorageItem?.token
      ).toEqual(C_PROVIDER1);
    }
    await app.close();
  });

  it('Custom error if provider not set', async () => {
    interface CProvider {
      type: string;
    }
    class CustomError extends CustomInjectorError<CProvider> {
      constructor(public override message: string) {
        super(message);
      }
    }
    const C_PROVIDER2 = 'C_PROVIDER2';
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER2, {
        errorFactory: (message: string) => new CustomError(message),
      })
      provider!: CProvider;
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
        `Provider "C_PROVIDER2" not found!`
      );
    }
    await app.close();
  });

  it('Default value if provider not set', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER1 = 'C_PROVIDER1';
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER1, {
        defaultProviderValue: { type: 'def' },
      })
      provider!: CProvider;
    }
    const module = await Test.createTestingModule({
      imports: [CustomInjectorModule.forRoot()],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const p = app.get<P>(P);
    expect(p.provider.type).toEqual('def');
    await app.close();
  });

  it('Async default value if provider not set', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER1 = 'C_PROVIDER1';
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER1, {
        defaultProviderValue: new Promise((resolve) =>
          setTimeout(() => resolve({ type: 'async' }), 1000)
        ),
      })
      provider!: CProvider;
    }
    const module = await Test.createTestingModule({
      imports: [CustomInjectorModule.forRoot()],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const p = app.get<P>(P);
    expect(p.provider.type).toEqual('async');
    await app.close();
  });

  it('Create provider with factory', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER = Symbol('C_PROVIDER');
    @Injectable()
    class C1 {
      name = 'c1';
    }
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER, {
        providerFactory: (data) => ({ type: data.name }),
      })
      provider!: CProvider;
    }
    const module = await Test.createTestingModule({
      imports: [
        CustomInjectorModule.forRoot(),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER, useClass: C1 }],
        }),
      ],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const p = app.get<P>(P);
    expect(p.provider.type).toEqual('c1');
    await app.close();
  });

  it('Create provider with async factory', async () => {
    interface CProvider {
      type: string;
    }
    const C_PROVIDER = Symbol('C_PROVIDER');
    @Injectable()
    class C1 {
      name = 'c1';
    }
    @Injectable()
    class P {
      @CustomInject<CProvider>(C_PROVIDER, {
        providerFactory: (data) =>
          new Promise((resolve) =>
            setTimeout(() => resolve({ type: data.name }), 1000)
          ),
      })
      provider!: CProvider;
    }
    const module = await Test.createTestingModule({
      imports: [
        CustomInjectorModule.forRoot(),
        CustomInjectorModule.forFeature({
          providers: [{ provide: C_PROVIDER, useClass: C1 }],
        }),
      ],
      providers: [P],
      exports: [P],
    }).compile();
    const app = module.createNestApplication();
    await app.init();
    const p = app.get<P>(P);
    expect(p.provider.type).toEqual('c1');
    await app.close();
  });
});
