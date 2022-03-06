import { Module } from '@nestjs/common';

import { ChannelModule } from '@src/modules/telegram/channel/channel.module';
import { ReportModule } from '@src/modules/telegram/report/report.module';

@Module({
  imports: [ReportModule, ChannelModule],
  controllers: [],
})
export class TelegramModule {}
