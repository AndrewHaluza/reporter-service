import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import CollectionsConstants from '@constants/collections.constants';
import { IReport } from '@src/modules/telegram/report/interfaces/report.interfaces';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(CollectionsConstants.reports)
    private readonly reportRepository: Model<IReport>,
  ) {}
}
