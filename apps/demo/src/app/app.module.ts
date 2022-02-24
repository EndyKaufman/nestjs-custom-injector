import { Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { AbstractClassModule } from './abstract-class/abstract-class.module';
import { StringTokenModule } from './string-token/string-token.module';

@Module({
  imports: [
    CustomInjectorModule.forRoot(),
    StringTokenModule,
    AbstractClassModule,
  ],
})
export class AppModule {}
