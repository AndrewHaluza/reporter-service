import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CronService } from '@src/modules/cron/cron.service';
import { ChannelModule } from '@src/modules/telegram/channel/channel.module';

@Module({
  imports: [ScheduleModule.forRoot(), ChannelModule],
  controllers: [],
  exports: [CronService],
  providers: [CronService],
})
export default class CronModule {}
