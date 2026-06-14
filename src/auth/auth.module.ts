import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from '../user/user.module';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';
import { UniversityModule } from '../university/university.module';
import { CompanyModule } from '../company/company.module';
import { StudentModule } from '../student/student.module';
import { MailModule } from '../mail/mail.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PasswordResetToken } from './entities/password-reset-token.entity';

@Module({
  imports: [
    UserModule,
    PassportModule,
    UniversityModule,
    CompanyModule,
    StudentModule,
    MailModule,

    TypeOrmModule.forFeature([ PasswordResetToken ]),

    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: {
          expiresIn: config.getOrThrow('JWT_EXPIRATION')
        }
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, BcryptAdapter],
})
export class AuthModule {}