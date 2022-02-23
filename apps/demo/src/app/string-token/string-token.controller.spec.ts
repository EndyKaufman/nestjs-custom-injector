import { Test, TestingModule } from '@nestjs/testing';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { StringTokenController } from './string-token.controller';
import { StringTokenModule } from './string-token.module';

describe('StringTokenController (unit)', () => {
  jest.setTimeout(3 * 60 * 1000);

  let app: TestingModule;
  let controller: StringTokenController;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [CustomInjectorModule.forRoot(), StringTokenModule],
    }).compile();
    controller = app.get<StringTokenController>(StringTokenController);
  });

  describe('Demo - collect providers with string token type', () => {
    it("Get all types of animals (@CustomInject(ANIMAL_PROVIDER, { multi: true, propertyName: 'type' }))", () => {
      const result = controller.animalTypesWithInject();
      expect([
        'dog',
        'cat',
        'horse',
        'sheep',
        'cow',
        'duck',
        'geese',
      ]).toMatchObject(result);
    });

    it('What says all animals (customInjectorService: CustomInjectorService)', () => {
      const result = controller.whatSaysAnimals();
      expect([
        'dog say woof',
        'cat say meow',
        'horse say neigh',
        'sheep say baa',
        'cow say moo',
        'duck say quack',
        'geese say honk',
      ]).toMatchObject(result);
    });

    it('What says all animals (@Inject(ANIMAL_PROVIDER))', () => {
      const result = controller.whatSaysAnimalsOriginal();
      expect('cat say meow').toEqual(result);
    });

    it('What says all animals (@CustomInject(ANIMAL_PROVIDER, { multi: true }))', () => {
      const result = controller.whatSaysAnimalsWithInject();
      expect([
        'dog say woof',
        'cat say meow',
        'horse say neigh',
        'sheep say baa',
        'cow say moo',
        'duck say quack',
        'geese say honk',
      ]).toMatchObject(result);
    });

    it('What says all animals (@CustomInjector())', () => {
      const result = controller.whatSaysAnimalsWithInjector();
      expect([
        'dog say woof',
        'cat say meow',
        'horse say neigh',
        'sheep say baa',
        'cow say moo',
        'duck say quack',
        'geese say honk',
      ]).toMatchObject(result);
    });

    it('Who say (customInjectorService: CustomInjectorService)', () => {
      const result = controller.whoSay('baa');
      expect('sheep say baa').toEqual(result);
    });

    it('Error in request who say (customInjectorService: CustomInjectorService)', () => {
      const result = controller.whoSay('gav');
      expect({ error: `I don't know who say gav` }).toMatchObject(result);
    });

    it('Who say (@Inject(ANIMAL_PROVIDER))', () => {
      const result = controller.whoSayOriginal('baa');
      expect({ error: `I don't know who say baa` }).toMatchObject(result);
    });

    it('Who say (@CustomInject(ANIMAL_PROVIDER, { multi: true }))', () => {
      const result = controller.whoSayWithInject('baa');
      expect('sheep say baa').toEqual(result);
    });

    it('Error in request who say (@CustomInject(ANIMAL_PROVIDER, { multi: true }))', () => {
      const result = controller.whoSayWithInject('gav');
      expect({ error: `I don't know who say gav` }).toMatchObject(result);
    });

    it('Who say (@CustomInjector())', () => {
      const result = controller.whoSayWithInjector('baa');
      expect('sheep say baa').toEqual(result);
    });

    it('Error in request who say (@CustomInjector())', () => {
      const result = controller.whoSayWithInjector('gav');
      expect({ error: `I don't know who say gav` }).toMatchObject(result);
    });
  });
});
