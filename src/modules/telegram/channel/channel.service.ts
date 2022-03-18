import CollectionsConstants from '@constants/collections.constants';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { ListChannelDto } from '@src/modules/telegram/channel/dto/list.dto';
import { IChannel } from '@src/modules/telegram/channel/interfaces/channel.interfaces';
import { Model, Types } from 'mongoose';

import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelCronStatusEnum } from '@src/modules/telegram/channel/enum/cronStatus.enum';
import { ChannelStatusEnum } from '@src/modules/telegram/channel/enum/status.enum';
import { TcChannelEntity } from '@src/entities/tcChannel.entity';
import { asyncEach } from '@src/utils';

@Injectable()
export class ChannelService {
  constructor(
    @InjectModel(CollectionsConstants.channels)
    private readonly channelRepository: Model<IChannel>,
    private httpService: HttpService,
  ) {}

  readonly logger: Logger = new Logger('channel.service');

  async create(createChannelDto: CreateChannelDto) {
    const modelChannel = new this.channelRepository(createChannelDto);

    return modelChannel.save();
  }

  async updateOne(query: any, createChannelDto: UpdateChannelDto) {
    return this.channelRepository.updateOne(query, createChannelDto);
  }

  async findOne(...args) {
    return this.channelRepository.findOne(...args);
  }

  private async createOrUpdate(
    createChannelDto: CreateChannelDto,
  ): Promise<ChannelCronStatusEnum> {
    const channelModel = await this.channelRepository.findOne(
      {
        name: createChannelDto.name,
      },
      { _id: 1, priority: 1 },
      { lean: true },
    );

    if (channelModel) {
      if (channelModel.priority === channelModel.priority) {
        return ChannelCronStatusEnum.skipped;
      }

      await this.updateOne(
        { _id: channelModel._id },
        { priority: createChannelDto.priority },
      );

      return ChannelCronStatusEnum.updated;
    }

    await this.create(createChannelDto);

    return ChannelCronStatusEnum.new;
  }

  async findAll(userId: string, params: ListChannelDto) {
    const { limit = 150 } = params;

    const _limit = Number(limit);

    const results = await this.channelRepository.aggregate([
      {
        $match: {
          status: ChannelStatusEnum.published,
        },
      },
      {
        $lookup: {
          from: CollectionsConstants.reports,
          let: {
            channelId: '$_id',
            userId: { $literal: new Types.ObjectId(userId) },
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$channelId', '$$channelId'] },
                    { $eq: ['$userId', '$$userId'] },
                  ],
                },
              },
            },
          ],
          as: 'report',
        },
      },
      {
        $addFields: {
          report: { $arrayElemAt: ['$report', 0] },
        },
      },
      {
        $sort: {
          'report.lastUsage': 1,
          priority: -1,
        },
      },
      { $limit: _limit },
      {
        $project: {
          _id: 0,
          name: 1,
        },
      },
    ]);

    return results;
  }

  async getStats() {
    return this.channelRepository.aggregate([
      {
        $facet: {
          published: [
            { $match: { status: ChannelStatusEnum.published } },
            { $count: 'count' },
          ],
          disabled: [
            { $match: { status: ChannelStatusEnum.disabled } },
            { $count: 'count' },
          ],
        },
      },
      {
        $project: {
          published: { $arrayElemAt: ['$published', 0] },
          disabled: { $arrayElemAt: ['$disabled', 0] },
        },
      },
      {
        $project: {
          published: '$published.count',
          disabled: '$disabled.count',
        },
      },
    ]);
  }

  private logCronUpdateResults(results: ChannelCronStatusEnum[]) {
    const counts = { new: 0, updated: 0, skipped: 0, total: 0 };

    results.forEach((el) => {
      counts.total += 1;

      switch (el) {
        case ChannelCronStatusEnum.new:
          counts.new += 1;
          break;
        case ChannelCronStatusEnum.updated:
          counts.updated += 1;
          break;
        case ChannelCronStatusEnum.skipped:
          counts.skipped += 1;
          break;
      }
    });

    this.logger.verbose(
      `cronUpdateList launched; new: ${counts.new}, updated: ${counts.updated}, skipped: ${counts.skipped} | total: ${counts.total}`,
    );
  }

  async cronUpdateListFromTcChannels(): Promise<void> {
    this.httpService.get(process.env.TC_CHANNELS_URL).subscribe(async (res) => {
      try {
        const tcChannels: TcChannelEntity[] = JSON.parse(
          `[${res.data.trim().split('\r\n').join(',')}]`,
        );

        const results = await asyncEach(
          tcChannels,
          (tcChannel: TcChannelEntity) =>
            this.createOrUpdate({ name: tcChannel.channel, priority: 0 }),
        );

        this.logCronUpdateResults(results);
      } catch (err) {
        this.logger.error(err.name, err.stack);
      }
    });
  }

  async cronUpdateList() {
    try {
      const gitChannelsListUrl = process.env.GIT_CHANNELS_LIST;

      return this.httpService.get(gitChannelsListUrl).subscribe(async (res) => {
        const channels = res.data.split('\n');
        const tasks = [];

        for (let i = 0; i < channels.length; i += 1) {
          const [name, priority = 0] = channels[i].split('|');

          tasks.push(
            this.createOrUpdate({
              name: name,
              priority: Number(priority),
            }),
          );
        }

        const results = await Promise.all(tasks);

        this.logCronUpdateResults(results);
      });
    } catch (error) {
      this.logger.error(error.name, error.stack);
    }
  }
}
