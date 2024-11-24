import { Injectable } from '@nestjs/common';
import { User, UserWithoutPassword } from './user.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/roles.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['roles'] });
  }

  async findAllWithRoles(): Promise<User[]> {
    return await this.userRepository.find({ relations: ['roles'] });
  }

  async findOne(id: number): Promise<User> {
    return await this.userRepository.findOneBy({ id });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
      relations: ['roles'],
    });
  }

  @Public()
  async create(user: CreateUserDto): Promise<UserWithoutPassword> {
    const existingRoles = await this.roleRepository.find({
      where: {
        name: In(user.roles),
      },
    });
    const newUser = this.userRepository.create({
      ...user,
      roles: existingRoles,
    });
    const savedUser = await this.userRepository.save(newUser);
    delete savedUser.password;
    return savedUser;
  }

  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepository.update(id, user);
    return await this.userRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
