import { Injectable } from '@nestjs/common';
import {
  CustomInject,
  CustomInjector,
  CustomInjectorService,
} from 'nestjs-custom-injector';
import { AbstractAnimalProvider } from './animal/animal.provider';
import { AbstractAnimalService } from './animal/animal.service';

@Injectable()
export class AbstractClassService {
  @CustomInjector()
  private customInjector!: CustomInjectorService;

  @CustomInject(AbstractAnimalProvider, { multi: true })
  private animalProviders!: AbstractAnimalProvider[];

  constructor(private readonly animalService: AbstractAnimalService) {}

  whatSaysAnimalsWithInjector() {
    return this.customInjector
      .getComponentsByClass<AbstractAnimalProvider>(AbstractAnimalProvider)
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
      .getComponentsByClass<AbstractAnimalProvider>(AbstractAnimalProvider)
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
