import { Injectable } from '@nestjs/common';
import { AbstractAnimalProvider } from '../animal/animal.provider';

@Injectable()
export class AnimalDucksService extends AbstractAnimalProvider {
  type = 'duck';
  say(): string {
    return 'quack';
  }
}
