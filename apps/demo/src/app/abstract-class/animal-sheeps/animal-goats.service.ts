import { Injectable } from '@nestjs/common';
import { AbstractAnimalProvider } from '../animal/animal.provider';

@Injectable()
export class AnimalGoatsService extends AbstractAnimalProvider {
  type = 'goat';
  say(): string {
    return 'baa';
  }
}
