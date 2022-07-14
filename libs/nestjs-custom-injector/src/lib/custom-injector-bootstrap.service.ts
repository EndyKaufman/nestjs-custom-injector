import {
  Injectable,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import {
  initAllProviders,
  setCustomInjectorStorage,
} from './custom-injector.storage';

@Injectable()
export class CustomInjectorBootstrapService
  implements OnApplicationBootstrap, OnModuleDestroy
{
  onModuleDestroy() {
    setCustomInjectorStorage([]);
  }
  async onApplicationBootstrap() {
    await initAllProviders();
  }
}
