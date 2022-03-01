import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

import jwtConstants from '@constants/jwt.constants';
import { IJwtStrategyValidate } from '@src/modules/auth/interfaces/jwtValidateStrategy.interfaces';

@Injectable()
export default class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.jwt.secret,
    });
  }

  validate(payload: {
    _id: string;
    exp: number;
    iat: number;
  }): IJwtStrategyValidate {
    return {
      _id: payload._id,
    };
  }
}
