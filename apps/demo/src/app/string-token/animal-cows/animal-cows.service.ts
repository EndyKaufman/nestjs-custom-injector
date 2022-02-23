import { Injectable } from '@nestjs/common';
import { AnimalProviderInteface } from '../animal/animal-provider.interface';

@Injectable()
export class AnimalCowsService implements AnimalProviderInteface {
  type = 'cow';
  say(): string {
    return 'moo';
  }
}
