import { PartialType } from '@nestjs/mapped-types';
import { CreateReportDto } from '@src/modules/telegram/report/dto/create-report.dto';

export class UpdateReportDto extends PartialType(CreateReportDto) {}
