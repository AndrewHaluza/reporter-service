import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './modules/telegram/telegram.module';
import { AuthModule } from '@src/modules/auth/auth.module';
import CronModule from '@src/modules/cron/cron.module';

const dotEnvPath = resolve(
  __dirname,
  '../',
  `${process.env.NODE_ENV || ''}.env`,
);

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: dotEnvPath });

const logger: Logger = new Logger('APP module');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: dotEnvPath,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI as string, {
      dbName: process.env.DB_NAME,
    }),
    CronModule,
    AuthModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
