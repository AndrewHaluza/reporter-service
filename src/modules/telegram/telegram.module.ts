import { Module } from '@nestjs/common';
import { ReportModule } from '@src/modules/telegram/report/report.module';
import { ChannelModule } from './channel/channel.module';

@Module({
  imports: [ReportModule, ChannelModule],
  controllers: [],
})
export class TelegramModule {}
