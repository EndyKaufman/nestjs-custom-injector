import { Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { AbstractAnimalService } from './animal.service';

@Module({
  imports: [CustomInjectorModule],
  providers: [AbstractAnimalService],
  exports: [AbstractAnimalService],
})
export class AnimalModule {}
