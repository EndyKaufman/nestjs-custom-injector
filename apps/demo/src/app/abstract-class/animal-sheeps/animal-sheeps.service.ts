import { Injectable } from '@nestjs/common';
import { AbstractAnimalProvider } from '../animal/animal.provider';

@Injectable()
export class AnimalSheepsService extends AbstractAnimalProvider {
  type = 'sheep';
  say(): string {
    return 'baa';
  }
}
