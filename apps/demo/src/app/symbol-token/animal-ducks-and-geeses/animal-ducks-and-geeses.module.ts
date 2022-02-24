import { Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { ANIMAL_PROVIDER } from '../animal/animal-provider.interface';
import { AnimalDucksService } from './animal-ducks.service';
import { AnimalGeesesService } from './animal-geeses.service';

@Module({
  imports: [
    CustomInjectorModule.forFeature({
      providers: [{ provide: ANIMAL_PROVIDER, useClass: AnimalDucksService }],
    }),
    CustomInjectorModule.forFeature({
      providers: [
        { provide: ANIMAL_PROVIDER, useValue: new AnimalGeesesService() },
      ],
    }),
  ],
})
export class AnimalDucksAndGeesesModule {}
