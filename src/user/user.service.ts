import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllUser(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findUserById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return user;
  }

  async createUser(data: CreateUserInput): Promise<User> {
    const user = await this.userRepository.create(data);

    const userSaved = await this.userRepository.save(user);

    if (!userSaved)
      throw new InternalServerErrorException(
        'Problem to create a user. Try again.',
      );

    return userSaved;
  }

  async updateUser(id: string, data: UpdateUserInput): Promise<User> {
    const user = await this.findUserById(id);

    await this.userRepository.update(user, { ...data });

    return this.userRepository.create({ ...user, ...data });
  }

  async deleteUser(id: string): Promise<boolean> {
    const user = await this.findUserById(id);

    const deleted = await this.userRepository.delete(user);

    return !!deleted;
  }
}
