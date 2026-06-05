import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { CommonModule } from '../common/common.module';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User ]),
    CommonModule
  ],
  controllers: [UserController],
  providers: [UserService, BcryptAdapter],
  exports: [
    UserService,
    TypeOrmModule
  ]
})
export class UserModule {}
