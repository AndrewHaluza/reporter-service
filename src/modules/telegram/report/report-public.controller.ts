import { Controller, Get, Req } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { ResponseReportStatsDto } from '@src/modules/telegram/report/dto/response/stats.dto';
import { ReportService } from '@src/modules/telegram/report/report.service';

@Controller('telegram/report')
export class ReportPublicController {
  constructor(private readonly reportService: ReportService) {}

  @ApiResponse({ type: ResponseReportStatsDto })
  @Get('/stats')
  getStats(@Req() req) {
    return this.reportService.getStats(req.user?._id);
  }
}
