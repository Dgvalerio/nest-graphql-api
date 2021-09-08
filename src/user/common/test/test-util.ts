import { User } from '../../user.entity';
import { CreateUserInput } from '../../dto/create-user.input';
import { UpdateUserInput } from '../../dto/update-user.input';

export const mockAddAccountParams: CreateUserInput = {
  name: 'Davi',
  email: 'valid@email.com',
  password: '123456',
};

export const mockUpdateUserParams: UpdateUserInput = {
  id: '1',
  name: 'Davi',
};

export const mockUserModel: User = {
  id: '1',
  ...mockAddAccountParams,
};

export const mockUpdatedUserModel: User = {
  ...mockUserModel,
  email: 'updated-email@email.com',
};

export const mockUserArrayModel: User[] = [
  mockUserModel,
  {
    id: '2',
    name: 'Test User 2',
    email: 'email2@email.com',
    password: '123456',
  },
  {
    id: '3',
    name: 'Test User 3',
    email: 'email3@email.com',
    password: '123456',
  },
];

export default class TestUtil {
  static giveMeAValidUser(): User {
    const user = new User();
    user.id = '1';
    user.name = 'Davi';
    user.email = 'valid@email.com';
    user.password = '123456';

    return user;
  }
}
