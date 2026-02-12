import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signUp(name: string, username: string, password: string) {
    const userExists = await this.userService.findOneByUsername(username);

    if (userExists) {
      throw new ConflictException('User already exists with given username.');
    }

    return this.userService.create(name, username, password);
  }

  async signIn(username: string, password: string) {
    const user = await this.userService.findOneByUsername(username);
    if (user) {
      const checkPassword = await bcrypt.compare(password, user?.password);

      if (!checkPassword) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        userId: user.id,
        username: user.username,
      };

      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }
}
