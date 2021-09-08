import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthInput } from './dto/auth.input';
import { compareSync } from 'bcrypt';
import { AuthType } from './dto/auth.type';
import { User } from '../user/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(data: AuthInput): Promise<AuthType> {
    const user = await this.userService.findUserByEmail(data.email);

    const validPassword = compareSync(data.password, user.password);

    if (!validPassword) throw new UnauthorizedException('Incorrect Password');

    const token = await this.jwtToken(user);

    return { user, token };
  }

  private async jwtToken(user: User): Promise<string> {
    const payload = { username: user.name, sub: user.id };

    return this.jwtService.signAsync(payload);
  }
}
