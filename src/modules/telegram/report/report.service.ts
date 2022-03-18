import { Model, Types } from 'mongoose';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import CollectionsConstants from '@constants/collections.constants';
import { IReport } from '@src/modules/telegram/report/interfaces/report.interfaces';
import { CreateReportDto } from '@src/modules/telegram/report/dto/create-report.dto';
import { ChannelService } from '@src/modules/telegram/channel/channel.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(CollectionsConstants.reports)
    private readonly reportRepository: Model<IReport>,
    private readonly channelService: ChannelService,
  ) {}

  private create(data) {
    const newModel = new this.reportRepository(data);

    return newModel.save();
  }

  async saveUsage(userId: string, dto: CreateReportDto) {
    const channelModel = await this.channelService.findOne(
      { name: dto.name },
      { _id: 1 },
      { lean: true },
    );

    if (!channelModel) {
      throw new BadRequestException('unexpected channel name');
    }

    const model = await this.reportRepository.findOne({
      userId,
      channelId: channelModel._id,
    });

    if (model) {
      model.lastUsage = new Date();
      model.usageCount += 1;

      model.save();

      return { status: 'ok' };
    }

    await this.create({
      userId: new Types.ObjectId(userId),
      channelId: channelModel._id,
      lastUsage: new Date(),
      usageCount: 1,
    });

    return { status: 'ok' };
  }

  async getStats(userId?: string) {
    /** public route - could be without userId */
    const [[reportResults], [channels]] = await Promise.all([
      this.reportRepository.aggregate([
        {
          $facet: {
            general: [
              { $group: { _id: null, count: { $sum: '$usageCount' } } },
            ],
            personal: [
              { $match: { userId: new Types.ObjectId(userId) } },
              {
                $group: {
                  _id: null,
                  count: { $sum: '$usageCount' },
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            general: { $arrayElemAt: ['$general.count', 0] },
            personal: { $arrayElemAt: ['$personal.count', 0] },
          },
        },
      ]),
      this.channelService.getStats(),
    ]);

    return { ...reportResults, channels };
  }
}
