import { Injectable } from '@nestjs/common';
import { AbstractAnimalProvider } from '../animal/animal.provider';

@Injectable()
export class AnimalHorsesService extends AbstractAnimalProvider {
  type = 'horse';
  say(): string {
    return 'neigh';
  }
}
