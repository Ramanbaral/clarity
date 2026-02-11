import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(
    fullname: string,
    username: string,
    password: string,
  ): Promise<User> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      username: username,
      name: fullname,
      password: hashedPassword,
    });

    return this.userRepository.save(newUser);
  }

  async findOneByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { username },
      select: ['id', 'username', 'password'],
    });

    return user;
  }
}
