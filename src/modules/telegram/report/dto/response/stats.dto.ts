import { ApiProperty } from '@nestjs/swagger';

export class ResponseReportStatsDto {
  @ApiProperty()
  general: number;

  @ApiProperty({
    description: 'would be returned in case authorized request',
    required: false,
  })
  personal?: number;
}
