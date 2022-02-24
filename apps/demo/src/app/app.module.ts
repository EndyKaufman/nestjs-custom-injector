import { Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { AbstractClassModule } from './abstract-class/abstract-class.module';
import { StringTokenModule } from './string-token/string-token.module';
import { SymbolTokenModule } from './symbol-token/symbol-token.module';

@Module({
  imports: [
    CustomInjectorModule.forRoot(),
    StringTokenModule,
    AbstractClassModule,
    SymbolTokenModule,
  ],
})
export class AppModule {}
