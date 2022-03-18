import { ApiProperty } from '@nestjs/swagger';

export class ResponseReportStatsChannelsDto {
  @ApiProperty({ required: false })
  published?: number;

  @ApiProperty({ required: false })
  disabled?: number;
}
