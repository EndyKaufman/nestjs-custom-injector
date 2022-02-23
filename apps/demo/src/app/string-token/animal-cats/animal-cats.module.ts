import { Module } from '@nestjs/common';
import { ANIMAL_PROVIDER } from '../animal/animal-provider.interface';
import { AnimalCatsService } from './animal-cats.service';

@Module({
  providers: [{ provide: ANIMAL_PROVIDER, useValue: new AnimalCatsService() }],
  exports: [ANIMAL_PROVIDER],
})
export class AnimalCatsModule {}
