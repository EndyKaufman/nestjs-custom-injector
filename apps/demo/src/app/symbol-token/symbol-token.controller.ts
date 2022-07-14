import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomInject } from 'nestjs-custom-injector';
import {
  AnimalProviderInteface,
  ANIMAL_PROVIDER,
} from './animal/animal-provider.interface';
import { CheckAnimalVoicePipe } from './animal/check-animal-voice.pipe';
import { SymbolTokenService } from './symbol-token.service';

@ApiTags('symbol-token')
@Controller('symbol-token')
export class SymbolTokenController {
  @CustomInject<AnimalProviderInteface>(ANIMAL_PROVIDER, {
    multi: true,
    propertyName: 'type',
  })
  private animalProviderTypes!: AnimalProviderInteface['type'][];

  constructor(
    @Inject(ANIMAL_PROVIDER)
    private readonly animalProvider: AnimalProviderInteface,
    private readonly symbolTokenService: SymbolTokenService
  ) {}

  @Get('animal-types-with-inject')
  animalTypesWithInject() {
    return this.animalProviderTypes;
  }

  @Get('what-says-animals')
  whatSaysAnimals() {
    return this.symbolTokenService.whatSaysAnimals();
  }

  @Get('what-says-animals-original')
  whatSaysAnimalsOriginal() {
    return `${this.animalProvider.type} say ${this.animalProvider.say()}`;
  }

  @Get('what-says-animals-with-inject')
  whatSaysAnimalsWithInject() {
    return this.symbolTokenService.whatSaysAnimalsWithInject();
  }

  @Get('what-says-animals-with-injector')
  whatSaysAnimalsWithInjector() {
    return this.symbolTokenService.whatSaysAnimalsWithInjector();
  }

  @Get('who-say')
  whoSay(@Query('voice') voice: string) {
    return this.symbolTokenService.whoSay(voice);
  }

  @Get('who-say-with-validate-type')
  whoSayWithValidateType(@Query('voice', CheckAnimalVoicePipe) voice: string) {
    return this.symbolTokenService.whoSay(voice);
  }

  @Get('who-say-original')
  whoSayOriginal(@Query('voice') voice: string) {
    return this.animalProvider.say() === voice
      ? `${this.animalProvider.type} say ${this.animalProvider.say()}`
      : { error: `I don't know who say ${voice}` };
  }

  @Get('who-say-with-inject')
  whoSayWithInject(@Query('voice') voice: string) {
    return this.symbolTokenService.whoSayWithInject(voice);
  }

  @Get('who-say-with-injector')
  whoSayWithInjector(@Query('voice') voice: string) {
    return this.symbolTokenService.whoSayWithInjector(voice);
  }
}
