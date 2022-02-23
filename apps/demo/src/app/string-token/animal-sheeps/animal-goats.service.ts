import { Injectable } from '@nestjs/common';
import { AnimalProviderInteface } from '../animal/animal-provider.interface';

@Injectable()
export class AnimalGoatsService implements AnimalProviderInteface {
  type = 'goat';
  say(): string {
    return 'baa';
  }
}
