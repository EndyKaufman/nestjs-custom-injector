import {
  HttpStatus,
  Injectable,
  Optional,
  ParseIntPipeOptions,
  PipeTransform,
} from '@nestjs/common';
import {
  ErrorHttpStatusCode,
  HttpErrorByCode,
} from '@nestjs/common/utils/http-error-by-code.util';
import { CustomInject } from 'nestjs-custom-injector';
import { AbstractAnimalProvider } from './animal.provider';

export interface CheckAnimalTypePipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exceptionFactory?: (error: string) => any;
}

@Injectable()
export class CheckAnimalVoicePipe implements PipeTransform<string> {
  @CustomInject(AbstractAnimalProvider, { multi: true })
  protected animalProviders!: AbstractAnimalProvider[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected exceptionFactory: (error: string) => any;

  constructor(@Optional() options?: ParseIntPipeOptions) {
    options = options || {};
    const { exceptionFactory, errorHttpStatusCode = HttpStatus.BAD_REQUEST } =
      options;

    this.exceptionFactory =
      exceptionFactory ||
      ((error) => new HttpErrorByCode[errorHttpStatusCode](error));
  }

  async transform(voice: string): Promise<string> {
    if (
      !this.animalProviders
        .map((animalProvider) => animalProvider.say())
        .includes(voice)
    ) {
      throw this.exceptionFactory(
        'Validation failed (incorrect voice of animals)'
      );
    }
    return voice;
  }
}
