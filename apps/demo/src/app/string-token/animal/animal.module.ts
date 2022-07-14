import { Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { StringAnimalService } from './animal.service';

@Module({
  imports: [CustomInjectorModule],
  providers: [StringAnimalService],
  exports: [StringAnimalService],
})
export class AnimalModule {}
