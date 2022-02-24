import { Injectable } from '@nestjs/common';
import { AnimalProviderInteface } from '../animal/animal-provider.interface';

@Injectable()
export class AnimalSheepsService implements AnimalProviderInteface {
  type = 'sheep';
  say(): string {
    return 'baa';
  }
}
