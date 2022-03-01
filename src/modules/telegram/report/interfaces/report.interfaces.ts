import { Document, Types } from 'mongoose';

export interface IReport extends Document {
  userId: Types.ObjectId;
  channelId: Types.ObjectId;
  lastUsage: Date;
  usageCount: number;
}
