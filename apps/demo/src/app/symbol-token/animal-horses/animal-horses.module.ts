import { Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { ANIMAL_PROVIDER } from '../animal/animal-provider.interface';
import { AnimalHorsesService } from './animal-horses.service';

@Module({
  imports: [CustomInjectorModule],
  providers: [
    { provide: ANIMAL_PROVIDER, useFactory: () => new AnimalHorsesService() },
  ],
  exports: [CustomInjectorModule],
})
export class AnimalHorsesModule {}
