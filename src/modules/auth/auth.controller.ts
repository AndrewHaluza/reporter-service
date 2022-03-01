import { Body, Controller, Post } from '@nestjs/common';
import { AuthorizeDto } from '@src/modules/auth/dto/authorize.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  authorize(@Body() body: AuthorizeDto) {
    return this.authService.authorize(body);
  }
}
