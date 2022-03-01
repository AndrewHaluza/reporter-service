import { Document } from 'mongoose';

export interface IChannel extends Document {
  name: string;
  priority: string;
}
