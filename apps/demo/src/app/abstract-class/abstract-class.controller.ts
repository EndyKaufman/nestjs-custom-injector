import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CustomInject } from 'nestjs-custom-injector';
import { AbstractClassService } from './abstract-class.service';
import { AbstractAnimalProvider } from './animal/animal.provider';
import { CheckAnimalVoicePipe } from './animal/check-animal-voice.pipe';

@ApiTags('abstract-class')
@Controller('abstract-class')
export class AbstractClassController {
  @CustomInject<AbstractAnimalProvider>(AbstractAnimalProvider, {
    multi: true,
    propertyName: 'type',
  })
  private animalProviderTypes!: AbstractAnimalProvider['type'][];

  constructor(
    @Inject(AbstractAnimalProvider)
    private readonly animalProvider: AbstractAnimalProvider,
    private readonly abstractClassService: AbstractClassService
  ) {}

  @Get('animal-types-with-inject')
  animalTypesWithInject() {
    return this.animalProviderTypes;
  }

  @Get('what-says-animals')
  whatSaysAnimals() {
    return this.abstractClassService.whatSaysAnimals();
  }

  @Get('what-says-animals-original')
  whatSaysAnimalsOriginal() {
    return `${this.animalProvider.type} say ${this.animalProvider.say()}`;
  }

  @Get('what-says-animals-with-inject')
  whatSaysAnimalsWithInject() {
    return this.abstractClassService.whatSaysAnimalsWithInject();
  }

  @Get('what-says-animals-with-injector')
  whatSaysAnimalsWithInjector() {
    return this.abstractClassService.whatSaysAnimalsWithInjector();
  }

  @Get('who-say')
  whoSay(@Query('voice') voice: string) {
    return this.abstractClassService.whoSay(voice);
  }

  @Get('who-say-with-validate-type')
  whoSayWithValidateType(@Query('voice', CheckAnimalVoicePipe) voice: string) {
    return this.abstractClassService.whoSay(voice);
  }

  @Get('who-say-original')
  whoSayOriginal(@Query('voice') voice: string) {
    return this.animalProvider.say() === voice
      ? `${this.animalProvider.type} say ${this.animalProvider.say()}`
      : { error: `I don't know who say ${voice}` };
  }

  @Get('who-say-with-inject')
  whoSayWithInject(@Query('voice') voice: string) {
    return this.abstractClassService.whoSayWithInject(voice);
  }

  @Get('who-say-with-injector')
  whoSayWithInjector(@Query('voice') voice: string) {
    return this.abstractClassService.whoSayWithInjector(voice);
  }
}
