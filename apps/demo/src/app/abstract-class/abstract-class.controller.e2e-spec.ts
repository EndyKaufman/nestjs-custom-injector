import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import request from 'supertest';
import { AbstractClassModule } from './abstract-class.module';

describe('AbstractClassController (e2e)', () => {
  jest.setTimeout(3 * 60 * 1000);

  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CustomInjectorModule.forRoot(), AbstractClassModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Demo - collect providers with string token type', () => {
    it("Get all types of animals (@CustomInject(AbstractAnimalProvider['type'], { multi: true, propertyName: 'type' }))", () => {
      return request(app.getHttpServer())
        .get('/abstract-class/animal-types-with-inject')
        .expect(200)
        .expect(['dog', 'cat', 'horse', 'sheep', 'cow', 'duck', 'geese']);
    });

    it('What says all animals (customInjectorService: CustomInjectorService)', () => {
      return request(app.getHttpServer())
        .get('/abstract-class/what-says-animals')
        .expect(200)
        .expect([
          'dog say woof',
          'cat say meow',
          'horse say neigh',
          'sheep say baa',
          'cow say moo',
          'duck say quack',
          'geese say honk',
        ]);
    });

    it('What says all animals (@Inject(AbstractAnimalProvider))', () => {
      return request(app.getHttpServer())
        .get('/abstract-class/what-says-animals-original')
        .expect(200)
        .expect('cat say meow');
    });

    it('What says all animals (@CustomInject(AbstractAnimalProvider, { multi: true }))', () => {
      return request(app.getHttpServer())
        .get('/abstract-class/what-says-animals-with-inject')
        .expect(200)
        .expect([
          'dog say woof',
          'cat say meow',
          'horse say neigh',
          'sheep say baa',
          'cow say moo',
          'duck say quack',
          'geese say honk',
        ]);
    });

    it('What says all animals (@CustomInjector())', () => {
      return request(app.getHttpServer())
        .get('/abstract-class/what-says-animals-with-injector')
        .expect(200)
        .expect([
          'dog say woof',
          'cat say meow',
          'horse say neigh',
          'sheep say baa',
          'cow say moo',
          'duck say quack',
          'geese say honk',
        ]);
    });

    it('Who say (customInjectorService: CustomInjectorService)', () => {
      return request(app.getHttpServer())
        .get('/abstract-class/who-say?voice=baa')
        .expect(200)
        .expect('sheep say baa');
    });

    it('Error in request who say (customInjectorService: CustomInjectorService)', () => {
      return request(app.getHttpServer())
        .get('/abstract-class/who-say?voice=gav')
        .expect(200)
        .expect({ error: `I don't know who say gav` });
    });

    it("Who say (@Query('voice', CheckAnimalTypePipe)", () => {
      try {
        return request(app.getHttpServer())
          .get('/abstract-class/who-say-with-validate-type?voice=baa')
          .expect(200)
          .expect('sheep say baa');
      } catch (err) {
        console.log(err);
      }
    });

    it("Error in request who say (@Query('voice', CheckAnimalTypePipe)", () => {
      try {
        return request(app.getHttpServer())
          .get('/abstract-class/who-say-with-validate-type?voice=gav')
          .expect(400)
          .expect({
            statusCode: 400,
            message: 'Validation failed (incorrect voice of animals)',
            error: 'Bad Request',
          });
      } catch (err) {
        console.log(err);
      }
    });

    it('Who say (@Inject(AbstractAnimalProvider))', () => {
      return request(app.getHttpServer())
        .get('/abstract-class/who-say-original?voice=baa')
        .expect(200)
        .expect({ error: `I don't know who say baa` });
    });

    it('Who say (@CustomInject(AbstractAnimalProvider, { multi: true }))', () => {
      return request(app.getHttpServer())
        .get('/abstract-class/who-say-with-inject?voice=baa')
        .expect(200)
        .expect('sheep say baa');
    });

    it('Error in request who say (@CustomInject(AbstractAnimalProvider, { multi: true }))', () => {
      return request(app.getHttpServer())
        .get('/abstract-class/who-say-with-inject?voice=gav')
        .expect(200)
        .expect({ error: `I don't know who say gav` });
    });

    it('Who say (@CustomInjector())', () => {
      return request(app.getHttpServer())
        .get('/abstract-class/who-say-with-injector?voice=baa')
        .expect(200)
        .expect('sheep say baa');
    });

    it('Error in request who say (@CustomInjector())', () => {
      return request(app.getHttpServer())
        .get('/abstract-class/who-say-with-injector?voice=gav')
        .expect(200)
        .expect({ error: `I don't know who say gav` });
    });
  });
});
