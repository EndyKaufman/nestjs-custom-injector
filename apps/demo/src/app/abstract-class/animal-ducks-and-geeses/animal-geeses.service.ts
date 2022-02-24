import { Injectable } from '@nestjs/common';
import { AbstractAnimalProvider } from '../animal/animal.provider';

@Injectable()
export class AnimalGeesesService extends AbstractAnimalProvider {
  type = 'geese';
  say(): string {
    return 'honk';
  }
}
