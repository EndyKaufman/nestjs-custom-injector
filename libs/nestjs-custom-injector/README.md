[![npm version](https://badge.fury.io/js/nestjs-custom-injector.svg)](https://badge.fury.io/js/nestjs-custom-injector)
[![monthly downloads](https://badgen.net/npm/dm/nestjs-custom-injector)](https://www.npmjs.com/package/nestjs-custom-injector)

## Installation

```bash
npm i --save nestjs-custom-injector
```

## Links

https://nestjs-custom-injector.site15.ru/api - Demo application with nestjs-custom-injector.
https://github.com/EndyKaufman/nestjs-custom-injector-example - Example generated with nest cli for "Usage" sections in readme.

## Usage

Create common interface with token in **animal-provider.interface.ts**

```typescript
export const ANIMAL_PROVIDER = 'ANIMAL_PROVIDER';

export interface AnimalProviderInteface {
  type: string;
  say(): string;
}
```

Create first type of logic for cats in **animal-cats.service.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { AnimalProviderInteface } from './animal-provider.interface';

@Injectable()
export class AnimalCatsService implements AnimalProviderInteface {
  type = 'cat';
  say(): string {
    return 'meow';
  }
}
```

Create second type of logic for dogs in **animal-dogs.service.ts**

```typescript
import { Injectable } from '@nestjs/common';
import { AnimalProviderInteface } from './animal-provider.interface';

@Injectable()
export class AnimalDogsService implements AnimalProviderInteface {
  type = 'dog';
  say(): string {
    return 'woof';
  }
}
```

Create controller **animals.controller.ts**

```typescript
import { Controller, Get, Query } from '@nestjs/common';
import { CustomInject } from 'nestjs-custom-injector';
import {
  AnimalProviderInteface,
  ANIMAL_PROVIDER,
} from './animal-provider.interface';

@Controller('animals')
export class AnimalsController {
  @CustomInject(ANIMAL_PROVIDER, { multi: true })
  private animalProviders!: AnimalProviderInteface[];

  @Get('animal-types')
  animalTypes() {
    return this.animalProviders.map((animalProvider) => animalProvider.type);
  }

  @Get('what-says-animals')
  whatSaysAnimals() {
    return this.animalProviders.map(
      (animal) => `${animal.type} say ${animal.say()}`
    );
  }

  @Get('who-say')
  whoSay(@Query('voice') voice: string) {
    const animal = this.animalProviders.find(
      (animal) => animal.say() === voice
    );
    if (!animal) {
      return { error: `I don't know who say ${voice}` };
    }
    return `${animal.type} say ${animal.say()}`;
  }
}
```

Append all logic to main app module **app.module.ts**

```typescript
import { Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { AnimalCatsService } from './animal-cats.service';
import { AnimalDogsService } from './animal-dogs.service';
import { AnimalsController } from './animals.controller';

@Module({
  ...
  imports: [
    ...
    CustomInjectorModule.forRoot(),
    CustomInjectorModule.forFeature({
      providers: [{ provide: ANIMAL_PROVIDER, useClass: AnimalCatsService }],
    }),
    CustomInjectorModule.forFeature({
      providers: [
        { provide: ANIMAL_PROVIDER, useValue: new AnimalDogsService() },
      ],
    }),
    ...
  ],
  controllers: [
    ...
    AnimalsController
    ...
  ]
  ...
})
export class AppModule {}
```

## License

MIT
