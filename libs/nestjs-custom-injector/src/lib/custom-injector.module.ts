import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { CustomInjectorBootstrapService } from './custom-injector-bootstrap.service';
import { CustomInjectorService } from './custom-injector.service';

@Module({
  imports: [DiscoveryModule],
  providers: [CustomInjectorService],
  exports: [DiscoveryModule, CustomInjectorService],
})
export class CustomInjectorCoreModule {}

@Module({
  imports: [CustomInjectorCoreModule],
  exports: [CustomInjectorCoreModule],
})
export class CustomInjectorModule {
  static forRoot(): DynamicModule {
    return {
      module: CustomInjectorModule,
      providers: [CustomInjectorBootstrapService],
    };
  }

  static forFeature(options: ModuleMetadata): DynamicModule {
    return {
      module: CustomInjectorModule,
      ...options,
    };
  }
}
