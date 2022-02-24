import { Injectable } from '@nestjs/common';
import { AbstractAnimalProvider } from '../animal/animal.provider';

@Injectable()
export class AnimalCatsService extends AbstractAnimalProvider {
  type = 'cat';
  say(): string {
    return 'meow';
  }
}
