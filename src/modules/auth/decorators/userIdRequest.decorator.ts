import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export default createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  return req.user._id.toString();
});
