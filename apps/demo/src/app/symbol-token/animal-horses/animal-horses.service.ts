import { Injectable } from '@nestjs/common';
import { AnimalProviderInteface } from '../animal/animal-provider.interface';

@Injectable()
export class AnimalHorsesService implements AnimalProviderInteface {
  type = 'horse';
  say(): string {
    return 'neigh';
  }
}
