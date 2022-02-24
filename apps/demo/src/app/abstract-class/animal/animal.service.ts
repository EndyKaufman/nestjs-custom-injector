import { Injectable } from '@nestjs/common';
import { CustomInjectorService } from 'nestjs-custom-injector';
import { AbstractAnimalProvider } from '../animal/animal.provider';

@Injectable()
export class AnimalService {
  constructor(private readonly customInjectorService: CustomInjectorService) {}

  getAnimals() {
    return this.customInjectorService.getComponentsByName<AbstractAnimalProvider>(
      AbstractAnimalProvider
    );
  }
}
