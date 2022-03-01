import { resolve } from 'path';

const dotEnvPath = resolve(
  __dirname,
  '../../',
  `${process.env.NODE_ENV || ''}.env`,
);

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: dotEnvPath });

const jwtConstants = {
  jwt: {
    expirationTime: {
      refreshTokenExpirationTime: '7d',
      accessTokenExpirationTime: '1d',
    },
    secret: process.env.JWT_SECRET,
  },
};

export default jwtConstants;
