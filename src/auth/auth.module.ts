import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from '../user/user.service';
import { AuthUtilsService } from './auth-utils.service';
import { JwtModule } from '@nestjs/jwt';
import { Role } from './roles.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: '600s' },
      }),
      // This is important to make the module available globally so that it can be used by other modules
      // when guard is applied to routes
      global: true,
    }),
  ],
  providers: [AuthService, UserService, AuthUtilsService],
  controllers: [AuthController],
})
export class AuthModule {}
