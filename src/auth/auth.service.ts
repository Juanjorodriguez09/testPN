import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';
import { MSG } from '../common/helpers/validation-messages.helper';

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

    if (!user) throw new UnauthorizedException(MSG.invalidCredentials);

    if ( !user.isActive ) 
      throw new UnauthorizedException(MSG.inactiveUser);

    const passwordMatch = await this.hasher.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException(MSG.invalidCredentials);

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const { password: pwd, ...loggedUser } = user;

    return {
      user: loggedUser,
      token
    };
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