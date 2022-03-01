/* eslint-disable camelcase */
import { Schema } from 'mongoose';

import CollectionsConstants from '@constants/collections.constants';
import { ChannelStatusEnum } from '@src/modules/telegram/channel/enum/status.enum';

const ChannelSchema = new Schema(
  {
    name: { type: String, required: true },
    priority: { type: Number, default: 0 },
    status: {
      type: String,
      enum: Object.values(ChannelStatusEnum),
      default: ChannelStatusEnum.published,
    },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: CollectionsConstants.channels,
  },
);

export default ChannelSchema;
