import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { AuthUtilsService } from './auth-utils.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly authUtilsService: AuthUtilsService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async login(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (
      user &&
      (await this.authUtilsService.comparePasswords(password, user.password))
    ) {
      const roles = user.roles;
      const accessToken = this.authUtilsService.generateToken({
        ...user,
        roles: roles.map((role) => role.name),
      });
      return { accessToken };
    }
  }

  async refreshToken(token: string) {
    const user = await this.authUtilsService.verifyToken(token);
    if (user) {
      const accessToken = this.authUtilsService.generateToken(user);
      return { accessToken };
    }
  }
}
