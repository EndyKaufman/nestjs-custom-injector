import { Injectable } from '@nestjs/common';
import { AnimalProviderInteface } from '../animal/animal-provider.interface';

@Injectable()
export class AnimalDucksService implements AnimalProviderInteface {
  type = 'duck';
  say(): string {
    return 'quack';
  }
}
