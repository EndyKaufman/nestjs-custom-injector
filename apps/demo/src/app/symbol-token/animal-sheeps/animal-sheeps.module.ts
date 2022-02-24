import { Module } from '@nestjs/common';
import { ANIMAL_PROVIDER } from '../animal/animal-provider.interface';
import { AnimalGoatsService } from './animal-goats.service';
import { AnimalSheepsService } from './animal-sheeps.service';

@Module({
  providers: [
    {
      provide: ANIMAL_PROVIDER,
      useValue: new AnimalGoatsService(),
    },
    {
      provide: ANIMAL_PROVIDER,
      useFactory: () =>
        new Promise((resolve) =>
          setTimeout(() => resolve(new AnimalSheepsService()), 5000)
        ),
    },
  ],
})
export class AnimalSheepsModule {}
