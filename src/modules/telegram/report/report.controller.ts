import { Public } from '@decorators/public.decorator';
import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import userIdRequestDecorator from '@src/modules/auth/decorators/userIdRequest.decorator';
import JwtAuthGuard from '@src/modules/auth/guards/jwt-auth.guard';
import { CreateReportDto } from '@src/modules/telegram/report/dto/create-report.dto';
import { ResponseReportStatsDto } from '@src/modules/telegram/report/dto/response/stats.dto';
import { ReportService } from '@src/modules/telegram/report/report.service';

@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('telegram/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/')
  saveUsage(@Body() dto: CreateReportDto, @userIdRequestDecorator() userId) {
    return this.reportService.saveUsage(userId, dto);
  }

  @Public()
  @ApiResponse({ type: ResponseReportStatsDto })
  @Get('/stats')
  getStats(@Req() req) {
    return this.reportService.getStats(req.user?._id);
  }
}
