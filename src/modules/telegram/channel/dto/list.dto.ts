import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class ListChannelDto {
  @IsNumberString()
  @ApiProperty({})
  limit: string;
}
