import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import TestUtil from './common/test/test-util';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    save: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  beforeEach(async () => {
    mockRepository.find.mockReset();
    mockRepository.findOne.mockReset();
    mockRepository.create.mockReset();
    mockRepository.update.mockReset();
    mockRepository.delete.mockReset();
    mockRepository.save.mockReset();
  });

  it('should be defined:', () => {
    expect(service).toBeDefined();
  });

  describe('When search All Users:', () => {
    it('should be list all users.', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.find.mockReturnValue([user, user]);

      const users = await service.findAllUser();

      expect(users).toHaveLength(2);
      expect(mockRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('When search User By Id:', () => {
    it('should find a existing user;', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);

      const userFound = await service.findUserById('1');

      expect(userFound).toMatchObject({ name: user.name });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when does not to find a user.', async () => {
      mockRepository.findOne.mockReturnValue(null);

      await expect(service.findUserById('1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('When create User:', () => {
    it('should create a user;', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockReturnValue(user);

      const savedUser = await service.createUser(user);

      expect(savedUser).toMatchObject(user);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('should return a exception when doesnt create a user.', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.create.mockReturnValue(user);
      mockRepository.save.mockReturnValue(null);

      await service.createUser(user).catch((e) => {
        expect(e).toBeInstanceOf(InternalServerErrorException);
        expect(e).toMatchObject({
          message: 'Problem to create a user. Try again.',
        });
      });

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('When update User:', () => {
    it('should update a user.', async () => {
      const user = TestUtil.giveMeAValidUser();
      const toUpdateInUser = { name: 'Nome atualizado' };
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.update.mockReturnValue({ ...user, ...toUpdateInUser });
      mockRepository.create.mockReturnValue({ ...user, ...toUpdateInUser });

      const updatedUser = await service.updateUser('1', {
        ...user,
        ...toUpdateInUser,
      });

      expect(updatedUser).toMatchObject({ ...user, ...toUpdateInUser });
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.update).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('When delete User:', () => {
    it('should delete a existing user;', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(user);

      const deletedUser = await service.deleteUser('1');

      expect(deletedUser).toBe(true);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });

    it('should not delete a nonexistent user.', async () => {
      const user = TestUtil.giveMeAValidUser();
      mockRepository.findOne.mockReturnValue(user);
      mockRepository.delete.mockReturnValue(null);

      const deletedUser = await service.deleteUser('1');

      expect(deletedUser).toBe(false);
      expect(mockRepository.findOne).toHaveBeenCalledTimes(1);
      expect(mockRepository.delete).toHaveBeenCalledTimes(1);
    });
  });
});
