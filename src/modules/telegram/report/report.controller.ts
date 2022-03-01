import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import userIdRequestDecorator from '@src/modules/auth/decorators/userIdRequest.decorator';
import JwtAuthGuard from '@src/modules/auth/guards/jwt-auth.guard';
import { CreateReportDto } from '@src/modules/telegram/report/dto/create-report.dto';
import { ReportService } from '@src/modules/telegram/report/report.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('telegram/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('/')
  saveUsage(@Body() dto: CreateReportDto, @userIdRequestDecorator() userId) {
    return this.reportService.saveUsage(userId, dto);
  }
}
