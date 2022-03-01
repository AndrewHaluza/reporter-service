/* eslint-disable camelcase */
import { Schema, Types } from 'mongoose';

import CollectionsConstants from '@constants/collections.constants';

const ReportSchema = new Schema(
  {
    userId: { type: Types.ObjectId, required: true },
    channelId: { type: Types.ObjectId, required: true },
    lastUsage: { type: Date, required: true },
    usageCount: { type: Number, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: CollectionsConstants.reports,
  },
);

export default ReportSchema;
