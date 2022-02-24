import { Module } from '@nestjs/common';
import { AbstractAnimalProvider } from '../animal/animal.provider';
import { AnimalDogsService } from './animal-dogs.service';

@Module({
  providers: [{ provide: AbstractAnimalProvider, useClass: AnimalDogsService }],
})
export class AnimalDogsModule {}
