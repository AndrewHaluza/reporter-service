import { ApiProperty } from '@nestjs/swagger';
import { ResponseReportStatsChannelsDto } from '@src/modules/telegram/report/dto/response/statsChannels.dto';

export class ResponseReportStatsDto {
  @ApiProperty()
  general: number;

  @ApiProperty({
    description: 'would be returned in case authorized request',
    required: false,
  })
  personal?: number;

  @ApiProperty({ type: ResponseReportStatsChannelsDto })
  channels: ResponseReportStatsChannelsDto;
}
