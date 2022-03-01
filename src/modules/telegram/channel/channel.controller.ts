import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import JwtAuthGuard from '@src/modules/auth/guards/jwt-auth.guard';
import { ChannelService } from './channel.service';
import userIdRequestDecorator from '@src/modules/auth/decorators/userIdRequest.decorator';
import { ListChannelDto } from '@src/modules/telegram/channel/dto/list.dto';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('telegram/channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  findAll(@Query() params: ListChannelDto, @userIdRequestDecorator() userId) {
    return this.channelService.findAll(userId, params);
  }
}
