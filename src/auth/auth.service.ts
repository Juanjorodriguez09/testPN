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
import { DataSource, EntityManager } from 'typeorm';
import { Role } from '../common/enums/role.enum';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { CompanyService } from '../company/company.service';
import { RegisterStudentDto } from './dto';
import { StudentService } from '../student/student.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly universityService: UniversityService,
    private readonly companyService: CompanyService,
    private readonly studentService: StudentService,
    private readonly hasher: BcryptAdapter,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource,
  ) {}

  async registerUniversity(registerUniversityDto: RegisterUniversityDto) {
    const { email, password, ...universityData } = registerUniversityDto;

    return this.withTransaction(async (manager) => {
      const { user, token } = await this.createUserWithToken(
        manager, email, password, Role.UNIVERSITY,
      );

      const university = await this.universityService.createWithManager(
        manager, universityData, user,
      );

      return { user, university, token };
    });
  }

  async registerCompany(registerCompanyDto: RegisterCompanyDto) {
    const { email, password, ...companyData } = registerCompanyDto;

    return this.withTransaction(async (manager) => {
      const { user, token } = await this.createUserWithToken(
        manager, email, password, Role.COMPANY,
      );

      const company = await this.companyService.createWithManager(
        manager, companyData, user,
      );

      return { user, company, token };
    });
  }

  async registerStudent(registerStudentDto: RegisterStudentDto) {
    const { email, password, ...studentData } = registerStudentDto;

    return this.withTransaction(async (manager) => {
      const { user, token } = await this.createUserWithToken(
        manager, email, password, Role.STUDENT,
      );

      const student = await this.studentService.createWithManager(
        manager, studentData, user,
      );

      return { user, student, token };
    });
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

  private async withTransaction<T>(operation: (manager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private async createUserWithToken(
    manager: EntityManager,
    email: string,
    password: string,
    role: Role,
  ) {
    const user = await this.userService.createWithManager(
      manager,
      { email, password, role, isActive: true },
    );

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

}