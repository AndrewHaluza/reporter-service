import { ApiProperty } from '@nestjs/swagger';

export class ResponseReportStatsDto {
  @ApiProperty()
  general: number;

  @ApiProperty()
  personal: number;
}
