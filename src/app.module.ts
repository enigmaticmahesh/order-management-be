import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvModule } from './configs/env.config';
import { DbModule } from './db/db.module';
import { AuthcoreModule } from './authcore/authcore.module';
import { MyModules } from './app-modules.config';

@Module({
  imports: [EnvModule, DbModule, AuthcoreModule, ...MyModules],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
