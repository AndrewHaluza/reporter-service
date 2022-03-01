import CollectionsConstants from '@constants/collections.constants';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { AuthorizeDto } from '@src/modules/auth/dto/authorize.dto';
import { IUser } from '@src/modules/user/interfaces/user.interfaces';
import jwtConstants from '@constants/jwt.constants';
import { ITokens } from '@src/modules/auth/interfaces/tokens.interfaces';
import { IAuthorize } from '@src/modules/auth/interfaces/authorize.interfaces';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(CollectionsConstants.users)
    private readonly userRepository: Model<IUser>,
    private readonly jwtService: JwtService,
  ) {}

  private async comparePassword(
    passedPassword: string,
    modelPassword: string,
  ): Promise<boolean> {
    const passwordCompared = await bcrypt.compare(
      passedPassword,
      modelPassword,
    );

    return passwordCompared;
  }

  private async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  private generateToken(userId: Types.ObjectId): ITokens {
    const payload = { _id: userId.toString() };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: jwtConstants.jwt.expirationTime.accessTokenExpirationTime,
      secret: jwtConstants.jwt.secret,
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: jwtConstants.jwt.expirationTime.refreshTokenExpirationTime,
      secret: jwtConstants.jwt.secret,
    });

    return { accessToken, refreshToken };
  }

  private async login(dto: AuthorizeDto, user: IUser): Promise<IAuthorize> {
    const passwordCompared = await this.comparePassword(
      dto.password,
      user.password,
    );

    if (!passwordCompared) {
      throw new UnauthorizedException();
    }

    const tokens = await this.generateToken(user._id);

    return { tokens };
  }

  private async signUp(dto: AuthorizeDto): Promise<IAuthorize> {
    const hashedPassword = await this.hashPassword(dto.password);
    const user = new this.userRepository({
      login: dto.login,
      password: hashedPassword,
    });

    await user.save();

    const tokens = await this.generateToken(user._id);

    return { tokens };
  }

  async authorize(dto: AuthorizeDto) {
    const user = await this.userRepository.findOne(
      { login: dto.login },
      {},
      { lean: true },
    );

    if (user) {
      return this.login(dto, user);
    }

    return this.signUp(dto);
  }
}
