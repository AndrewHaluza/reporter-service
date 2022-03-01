/* eslint-disable camelcase */
import { Schema } from 'mongoose';

import CollectionsConstants from '@constants/collections.constants';

const UserSchema = new Schema(
  {
    login: { type: String, required: true },
    password: { type: String, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
    collection: CollectionsConstants.users,
  },
);

export default UserSchema;
