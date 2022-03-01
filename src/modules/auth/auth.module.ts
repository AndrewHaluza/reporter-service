import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import CollectionsConstants from '@constants/collections.constants';
import UserSchema from '@src/modules/user/entities/user.entity';
import jwtConstants from '@constants/jwt.constants';
import JwtStrategy from '@src/modules/auth/strategies/jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.jwt.secret,
      signOptions: {
        expiresIn: jwtConstants.jwt.expirationTime.accessTokenExpirationTime,
      },
    }),
    MongooseModule.forFeature([
      {
        name: CollectionsConstants.users,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
