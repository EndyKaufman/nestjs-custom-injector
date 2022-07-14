import { Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { SymbolAnimalService } from './animal.service';

@Module({
  imports: [CustomInjectorModule],
  providers: [SymbolAnimalService],
  exports: [SymbolAnimalService],
})
export class AnimalModule {}
