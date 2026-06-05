import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly hasher: BcryptAdapter,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  async login(email: string, password: string) {

    const user = await this.userService.findByEmailWithPassword(email.toLowerCase());

    if (!user) throw new UnauthorizedException('Invalid credentials');

    if ( !user.isActive ) 
      throw new UnauthorizedException('User inactive, talk with an admin');

    const passwordMatch = await this.hasher.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: new UserResponseDto(user),
      token
    };
  }

  async logout(userId: string): Promise<void> {
    // Invalida el refresh token almacenado
    // await this.userService.updateRefreshToken(userId, null);
  }

  /**
   * Genera el token a partir del payload
   * 
   * @param payload 
   * @returns 
   */
  private generateToken(payload: JwtPayload): string {
    const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_EXPIRATION'),
      });

    return accessToken;
  }

}