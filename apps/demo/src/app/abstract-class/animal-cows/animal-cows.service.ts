import { Injectable } from '@nestjs/common';
import { AbstractAnimalProvider } from '../animal/animal.provider';

@Injectable()
export class AnimalCowsService extends AbstractAnimalProvider {
  type = 'cow';
  say(): string {
    return 'moo';
  }
}
