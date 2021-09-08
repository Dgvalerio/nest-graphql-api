import { User } from '../../user.entity';

export default class TestUtil {
  static giveMeAValidUser(): User {
    const user = new User();
    user.id = '1';
    user.name = 'Davi';
    user.email = 'valid@email.com';

    return user;
  }
}
