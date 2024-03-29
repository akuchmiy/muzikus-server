import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Redirect,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { LocalAuthGuard } from './guards/local.auth.guard'
import { User } from '../../model/user.entity'
import { Response } from 'express'
import { CreateUserDto } from '../../dtos/CreateUserDto'
import { Request } from 'express'
import { RefreshAuthGuard } from './guards/refresh.auth.guard'
import { configService } from '../../config/configService'
import { userValidationPipe } from '../../pipes/userValidationPipe'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //@UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: Request & { user: User },
    @Res({ passthrough: true }) res: Response
  ) {
    const user = req.user
    const loginData = await this.authService.login(user)

    res.cookie('refresh-token', loginData.refreshToken, {
      httpOnly: true,
    })

    return loginData.user
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @UsePipes(userValidationPipe)
  @Post('register')
  async register(@Body() user: CreateUserDto): Promise<User> {
    return this.authService.register(user)
  }

  @Redirect(configService.getValue('CLIENT_URL'), 302)
  @Get('activate/:id')
  async activate(@Param('id', ParseUUIDPipe) userId) {
    await this.authService.activate(userId)
  }

  // @UseGuards(JwtRefreshAuthGuard)
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshAccessToken(
    @Req() req: Request & { user: User },
    @Res({ passthrough: true }) res: Response
  ) {
    const user = req.user
    const loginData = await this.authService.login(user)

    res.cookie('refresh-token', loginData.refreshToken, {
      httpOnly: true,
    })

    return loginData.user
  }
}
