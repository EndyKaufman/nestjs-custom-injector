import { Injectable } from '@nestjs/common';
import { AnimalProviderInteface } from '../animal/animal-provider.interface';

@Injectable()
export class AnimalGeesesService implements AnimalProviderInteface {
  type = 'geese';
  say(): string {
    return 'honk';
  }
}
