import { DynamicModule, Module, ModuleMetadata } from '@nestjs/common';
import { CustomInjectorService } from './custom-injector.service';

@Module({
  providers: [CustomInjectorService],
  exports: [CustomInjectorService],
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
    };
  }

  static forFeature(options: ModuleMetadata): DynamicModule {
    return {
      module: CustomInjectorModule,
      ...options,
    };
  }
}
