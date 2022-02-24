import { Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { AbstractAnimalProvider } from '../animal/animal.provider';
import { AnimalHorsesService } from './animal-horses.service';

@Module({
  imports: [CustomInjectorModule],
  providers: [
    {
      provide: AbstractAnimalProvider,
      useFactory: () => new AnimalHorsesService(),
    },
  ],
  exports: [CustomInjectorModule],
})
export class AnimalHorsesModule {}
