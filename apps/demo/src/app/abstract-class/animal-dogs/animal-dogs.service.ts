import { Injectable } from '@nestjs/common';
import { AbstractAnimalProvider } from '../animal/animal.provider';

@Injectable()
export class AnimalDogsService extends AbstractAnimalProvider {
  type = 'dog';
  say(): string {
    return 'woof';
  }
}
