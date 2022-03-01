import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import JwtAuthGuard from '@src/modules/auth/guards/jwt-auth.guard';
import { ReportService } from '@src/modules/telegram/report/report.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('telegram/report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}
}
