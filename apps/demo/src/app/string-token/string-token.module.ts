import { Module } from '@nestjs/common';
import { AnimalCatsModule } from './animal-cats/animal-cats.module';
import { AnimalCowsModule } from './animal-cows/animal-cows.module';
import { AnimalDogsModule } from './animal-dogs/animal-dogs.module';
import { AnimalDucksAndGeesesModule } from './animal-ducks-and-geeses/animal-ducks-and-geeses.module';
import { AnimalHorsesModule } from './animal-horses/animal-horses.module';
import { AnimalSheepsModule } from './animal-sheeps/animal-sheeps.module';
import { AnimalModule } from './animal/animal.module';
import { StringTokenController } from './string-token.controller';
import { StringTokenService } from './string-token.service';

@Module({
  imports: [
    AnimalModule,
    AnimalDogsModule,
    AnimalCatsModule,
    AnimalHorsesModule,
    AnimalSheepsModule,
    AnimalCowsModule,
    AnimalDucksAndGeesesModule,
  ],
  controllers: [StringTokenController],
  providers: [StringTokenService],
})
export class StringTokenModule {}
