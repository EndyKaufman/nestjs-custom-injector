import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CustomInjectorService } from './custom-injector.service';

@Injectable()
export class CustomInjectorBootstrapService implements OnApplicationBootstrap {
  constructor(private customInjectorService: CustomInjectorService) {}
  async onApplicationBootstrap() {
    await this.customInjectorService.initAllProviders();
  }
}
