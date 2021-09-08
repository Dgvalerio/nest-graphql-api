import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateUserInput } from './dto/create-user.input';
import { User } from './user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { GqlAuthGuard } from '../auth/auth.guard';
import { UseGuards } from '@nestjs/common';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [User])
  async users(): Promise<User[]> {
    return this.userService.findAllUser();
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async user(@Args('id') id: string): Promise<User> {
    return this.userService.findUserById(id);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  async userByEmail(@Args('email') email: string): Promise<User> {
    return this.userService.findUserByEmail(email);
  }

  @Mutation(() => User)
  async createUser(@Args('data') data: CreateUserInput): Promise<User> {
    return this.userService.createUser(data);
  }

  @Mutation(() => User)
  async updateUser(
    @Args('id') id: string,
    @Args('data') data: UpdateUserInput,
  ): Promise<User> {
    return this.userService.updateUser(id, data);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string): Promise<boolean> {
    return this.userService.deleteUser(id);
  }
}
