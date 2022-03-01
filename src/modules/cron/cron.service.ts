import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { LogErrorDecorator } from '@decorators/logError.decorator';
import { ChannelService } from '@src/modules/telegram/channel/channel.service';

/**
 *   +---------------- minute (0 - 59)
 *   |  +------------- hour (0 - 23)
 *   |  |  +---------- day of month (1 - 31)
 *   |  |  |  +------- month (1 - 12)
 *   |  |  |  |  +---- day of week (0 - 7) (Sunday=0 or 7)
 *   |  |  |  |  |
 *   *  *  *  *  *  command to be executed
 *  --------------------------------------------------------------------------
 */

@Injectable()
export class CronService {
  readonly logger: Logger = new Logger('cron.service');

  constructor(private channelService: ChannelService) {}

  @Cron(CronExpression.EVERY_2_HOURS)
  // @Cron(CronExpression.EVERY_10_SECONDS)
  @LogErrorDecorator()
  async updateChannelsList() {
    return this.channelService.cronUpdateList();
  }
}
