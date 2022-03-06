import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context) {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );

    if (err) {
      throw err;
    }

    if (isPublic) {
      return user || null;
    }

    if (info) {
      if (info.name === 'TokenExpiredError') {
        // eslint-disable-next-line no-param-reassign
        info.status = 401;
      }

      throw new UnauthorizedException(info);
    }

    return user;
  }
}
