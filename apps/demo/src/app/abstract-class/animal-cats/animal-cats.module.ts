import { Module } from '@nestjs/common';
import { AbstractAnimalProvider } from '../animal/animal.provider';
import { AnimalCatsService } from './animal-cats.service';

@Module({
  providers: [
    { provide: AbstractAnimalProvider, useValue: new AnimalCatsService() },
  ],
  exports: [AbstractAnimalProvider],
})
export class AnimalCatsModule {}
