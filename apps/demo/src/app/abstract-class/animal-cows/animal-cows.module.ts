import { Module } from '@nestjs/common';
import { lastValueFrom, Observable } from 'rxjs';
import { AbstractAnimalProvider } from '../animal/animal.provider';
import { AnimalCowsService } from './animal-cows.service';

@Module({
  providers: [
    {
      provide: AbstractAnimalProvider,
      useFactory: () =>
        lastValueFrom(
          new Observable((observer) => {
            setTimeout(() => {
              observer.next(new AnimalCowsService());
              observer.complete();
            }, 5000);
          })
        ),
    },
  ],
})
export class AnimalCowsModule {}
