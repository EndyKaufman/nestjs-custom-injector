import { Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { AbstractAnimalProvider } from '../animal/animal.provider';
import { AnimalDucksService } from './animal-ducks.service';
import { AnimalGeesesService } from './animal-geeses.service';

@Module({
  imports: [
    CustomInjectorModule.forFeature({
      providers: [
        { provide: AbstractAnimalProvider, useClass: AnimalDucksService },
      ],
    }),
    CustomInjectorModule.forFeature({
      providers: [
        {
          provide: AbstractAnimalProvider,
          useValue: new AnimalGeesesService(),
        },
      ],
    }),
  ],
})
export class AnimalDucksAndGeesesModule {}
