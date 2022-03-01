import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, default: 0 })
  priority?: number;
}
