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
import {
  AnimalProviderInteface,
  ANIMAL_PROVIDER,
} from './animal-provider.interface';

export interface CheckAnimalTypePipeOptions {
  errorHttpStatusCode?: ErrorHttpStatusCode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  exceptionFactory?: (error: string) => any;
}

@Injectable()
export class CheckAnimalTypePipe implements PipeTransform<string> {
  @CustomInject(ANIMAL_PROVIDER, { multi: true, propertyName: 'type' })
  protected animalProviderTypes!: AnimalProviderInteface['type'][];

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

  async transform(value: string): Promise<string> {
    console.log(value, this.animalProviderTypes);
    if (!this.animalProviderTypes.includes(value)) {
      throw this.exceptionFactory(
        'Validation failed (incorrect type of animals)'
      );
    }
    return value;
  }
}
