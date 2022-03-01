import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthorizeDto {
  @IsString()
  @ApiProperty()
  login: string;

  @IsString()
  @ApiProperty()
  password: string;
}
