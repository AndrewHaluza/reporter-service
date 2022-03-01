import CollectionsConstants from '@constants/collections.constants';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChannelModule } from '@src/modules/telegram/channel/channel.module';
import ReportSchema from '@src/modules/telegram/report/entities/report.entity';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionsConstants.reports,
        schema: ReportSchema,
      },
    ]),
    ChannelModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
