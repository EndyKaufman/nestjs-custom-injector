import { Module } from '@nestjs/common';
import { CustomInjectorModule } from 'nestjs-custom-injector';
import { StringTokenModule } from './string-token/string-token.module';

@Module({
  imports: [CustomInjectorModule.forRoot(), StringTokenModule],
})
export class AppModule {}
