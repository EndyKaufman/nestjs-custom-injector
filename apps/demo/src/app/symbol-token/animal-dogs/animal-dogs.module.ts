import { Module } from '@nestjs/common';
import { ANIMAL_PROVIDER } from '../animal/animal-provider.interface';
import { AnimalDogsService } from './animal-dogs.service';

@Module({
  providers: [{ provide: ANIMAL_PROVIDER, useClass: AnimalDogsService }],
})
export class AnimalDogsModule {}
