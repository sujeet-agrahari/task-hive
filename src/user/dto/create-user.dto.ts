import { IsEmail, IsEnum, IsNotEmpty, MinLength } from 'class-validator';
import { UserRoles } from 'src/auth/auth.constant';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsEnum(UserRoles, { each: true })
  roles: string[] = [UserRoles.USER];
}
