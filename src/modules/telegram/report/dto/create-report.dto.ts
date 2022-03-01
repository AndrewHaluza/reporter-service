import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateReportDto {
  @IsString()
  @ApiProperty()
  name: string;
}
