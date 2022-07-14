import { Injectable } from '@nestjs/common';
import { CustomInjectorService } from 'nestjs-custom-injector';
import { AbstractAnimalProvider } from './animal.provider';

@Injectable()
export class AbstractAnimalService {
  constructor(private readonly customInjectorService: CustomInjectorService) {}

  getAnimals() {
    return this.customInjectorService.getProviders<AbstractAnimalProvider>(
      AbstractAnimalProvider
    );
  }
}
