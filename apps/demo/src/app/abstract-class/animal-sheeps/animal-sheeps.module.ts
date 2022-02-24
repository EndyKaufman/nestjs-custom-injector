import { Module } from '@nestjs/common';
import { AbstractAnimalProvider } from '../animal/animal.provider';
import { AnimalGoatsService } from './animal-goats.service';
import { AnimalSheepsService } from './animal-sheeps.service';

@Module({
  providers: [
    {
      provide: AbstractAnimalProvider,
      useValue: new AnimalGoatsService(),
    },
    {
      provide: AbstractAnimalProvider,
      useFactory: () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(new AnimalSheepsService()), 5000)
        ),
    },
  ],
})
export class AnimalSheepsModule {}
