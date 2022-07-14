import { Injectable } from '@nestjs/common';
import { CustomInjectorService } from 'nestjs-custom-injector';
import {
  AnimalProviderInteface,
  ANIMAL_PROVIDER,
} from '../animal/animal-provider.interface';

@Injectable()
export class StringAnimalService {
  constructor(private readonly customInjectorService: CustomInjectorService) {}

  getAnimals() {
    return this.customInjectorService.getProviders<AnimalProviderInteface>(
      ANIMAL_PROVIDER
    );
  }
}
