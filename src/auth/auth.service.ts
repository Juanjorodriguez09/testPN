import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';
import { MSG } from '../common/helpers/validation-messages.helper';
import { RegisterUniversityDto } from './dto/register-university.dto';
import { UniversityService } from '../university/university.service';
import { DataSource } from 'typeorm';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly universityService: UniversityService,
    private readonly hasher: BcryptAdapter,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async registerUniversity(registerUniversityDto: RegisterUniversityDto) {
    
    const { email, password, ...universityData } = registerUniversityDto;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      const user = await this.userService.createWithManager(
        queryRunner.manager,
        { email, password, role: Role.UNIVERSITY, isActive: true },
      );

      const university = await this.universityService.createWithManager(
        queryRunner.manager,
        { ...universityData },
        user,
      );

      await queryRunner.commitTransaction();
  
      const token = this.generateToken({
        id: user.id,
        email: user.email,
        role: user.role,
      });
  
      return {
        user,
        university,
        token
      }
      
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
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