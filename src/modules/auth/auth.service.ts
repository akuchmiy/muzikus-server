import { Injectable } from '@nestjs/common'
import { UserSearchBy, UserService } from '../user/user.service'
import { JwtService } from '@nestjs/jwt'
import { User } from '../../model/user.entity'
import * as bcrypt from 'bcryptjs'
import { CreateUserDto } from '../../dtos/CreateUserDto'

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<Partial<User>> {
    const user = await this.userService.findOne(email, UserSearchBy.email)
    // if (!user.confirmed) return null

    const equals = await bcrypt.compare(password, user.password)
    if (user && equals) {
      const { password, ...rest } = user
      return rest
    }
    return null
  }

  async login(user: Partial<User>): Promise<{ accessToken: string }> {
    const payload = { email: user.email, sub: user.id }

    return { accessToken: this.jwtService.sign(payload) }
  }

  async register(user: CreateUserDto): Promise<Partial<User>> {
    const encrypted = await bcrypt.hash(user.password, 7)

    return this.userService.createOne({
      email: user.email,
      password: encrypted,
    })
  }
}
