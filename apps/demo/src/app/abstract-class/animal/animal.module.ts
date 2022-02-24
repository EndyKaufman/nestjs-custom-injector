import { Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { AnimalService } from './animal.service';

@Module({
  imports: [CustomInjectorModule],
  providers: [AnimalService],
  exports: [AnimalService],
})
export class AnimalModule {}
