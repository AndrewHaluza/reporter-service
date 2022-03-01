import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import CollectionsConstants from '@constants/collections.constants';
import ChannelSchema from '@src/modules/telegram/channel/entities/channel.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: CollectionsConstants.channels,
        schema: ChannelSchema,
      },
    ]),
    HttpModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
