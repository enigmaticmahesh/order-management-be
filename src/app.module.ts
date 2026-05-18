import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './configs/env.config';
import { DbModule } from './db/db.module';
import { SharedCoreModule } from './sharedcore/sharedcore.module';
import { MyModules } from './app-modules.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    EnvModule,
    DbModule,
    JwtModule.register({ global: true }),
    SharedCoreModule,
    ...MyModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
