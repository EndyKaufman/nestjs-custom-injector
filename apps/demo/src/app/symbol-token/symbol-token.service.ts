import { Injectable } from '@nestjs/common';
import {
  CustomInject,
  CustomInjector,
  CustomInjectorService,
} from 'nestjs-custom-injector';
import {
  AnimalProviderInteface,
  ANIMAL_PROVIDER,
} from './animal/animal-provider.interface';
import { AnimalService } from './animal/animal.service';

@Injectable()
export class SymbolTokenService {
  @CustomInjector()
  private customInjector!: CustomInjectorService;

  @CustomInject(ANIMAL_PROVIDER, { multi: true })
  private animalProviders!: AnimalProviderInteface[];

  constructor(private readonly animalService: AnimalService) {}

  whatSaysAnimalsWithInjector() {
    return this.customInjector
      .getComponentsByName<AnimalProviderInteface>(ANIMAL_PROVIDER)
      .map((animal) => `${animal.type} say ${animal.say()}`);
  }

  whatSaysAnimalsWithInject() {
    return this.animalProviders.map(
      (animal) => `${animal.type} say ${animal.say()}`
    );
  }

  whatSaysAnimals() {
    return this.animalService
      .getAnimals()
      .map((animal) => `${animal.type} say ${animal.say()}`);
  }

  whoSayWithInjector(voice: string) {
    const animal = this.customInjector
      .getComponentsByName<AnimalProviderInteface>(ANIMAL_PROVIDER)
      .find((animal) => animal.say() === voice);
    if (!animal) {
      return { error: `I don't know who say ${voice}` };
    }
    return `${animal.type} say ${animal.say()}`;
  }

  whoSayWithInject(voice: string) {
    const animal = this.animalProviders.find(
      (animal) => animal.say() === voice
    );
    if (!animal) {
      return { error: `I don't know who say ${voice}` };
    }
    return `${animal.type} say ${animal.say()}`;
  }

  whoSay(voice: string) {
    const animal = this.animalService
      .getAnimals()
      .find((animal) => animal.say() === voice);
    if (!animal) {
      return { error: `I don't know who say ${voice}` };
    }
    return `${animal.type} say ${animal.say()}`;
  }
}
