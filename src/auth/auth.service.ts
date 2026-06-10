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

  /**
   * Registra una nueva universidad junto a su usuario relacionado.
   * Crea el usuario y la entidad `University` dentro de una transacción.
   * @param registerUniversityDto - DTO con `email`, `password` y datos de universidad.
   * @returns Objeto con `user`, `university` y `token`.
   */
  async registerUniversity(registerUniversityDto: RegisterUniversityDto) {
    // Separar credenciales del payload de la universidad
    const { email, password, ...universityData } = registerUniversityDto;

    // Ejecutar la creación dentro de una transacción para mantener consistencia
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

  /**
   * Registra una nueva compañía junto a su usuario relacionado.
   * La operación se realiza dentro de una transacción.
   * @param registerCompanyDto - DTO con `email`, `password` y datos de la compañía.
   * @returns Objeto con `user`, `company` y `token`.
   */
  async registerCompany(registerCompanyDto: RegisterCompanyDto) {
    // Extraer email y password del DTO
    const { email, password, ...companyData } = registerCompanyDto;

    // Usar transacción para crear usuario y compañía de forma atómica
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

  /**
   * Registra un nuevo estudiante junto a su usuario relacionado.
   * Se ejecuta en una transacción que crea `User` y `Student`.
   * @param registerStudentDto - DTO con `email`, `password` y datos del estudiante.
   * @returns Objeto con `user`, `student` y `token`.
   */
  async registerStudent(registerStudentDto: RegisterStudentDto) {
    // Separar credenciales del DTO del estudiante
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

  /**
   * Realiza login verificando credenciales y estado del usuario.
   * @param email - Email del usuario.
   * @param password - Contraseña en texto plano para comparar.
   * @returns Objeto con `user` (sin password) y `token` JWT.
   * @throws `UnauthorizedException` si las credenciales son inválidas o el usuario está inactivo.
   */
  async login(email: string, password: string) {

    const user = await this.userService.findByEmailWithPassword(email.toLowerCase());

    if (!user) throw new UnauthorizedException(MSG.invalidCredentials());

    if ( !user.isActive ) 
      throw new UnauthorizedException(MSG.inactiveUser());

    const passwordMatch = await this.hasher.compare(password, user.password);
    if (!passwordMatch) throw new UnauthorizedException(MSG.invalidCredentials());

    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Selecciona el perfil según el rol y elimina las relaciones individuales
    const profileMap: Record<string, any> = {
      university : user.university,
      company    : user.company,
      student    : user.student,
    };

    const { password: pwd, university, company, student, ...rest } = user;

    return {
      user: { ...rest, profile: profileMap[user.role] ?? null },
      token,
    };
  }

  /**
   * Genera un JWT a partir del payload.
   * @param payload - Objeto con `id`, `email` y `role` del usuario.
   * @returns Token firmado (string).
   */
  private generateToken(payload: JwtPayload): string {
    const accessToken = this.jwtService.sign(payload, {
        secret: this.configService.getOrThrow('JWT_SECRET'),
        expiresIn: this.configService.getOrThrow('JWT_EXPIRATION'),
      });

    return accessToken;
  }

  /**
   * Ejecuta una operación dentro de una transacción de TypeORM.
   * @param operation - Función que recibe un `EntityManager` y realiza operaciones sobre la BD.
   * @returns El resultado de la operación ejecutada dentro de la transacción.
   * @throws Re-lanza cualquier error ocurrido durante la operación tras hacer rollback.
   */
  private async withTransaction<T>(operation: (manager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // Ejecutar la operación pasando el EntityManager de la transacción
      const result = await operation(queryRunner.manager);
      // Confirmar la transacción si todo salió bien
      await queryRunner.commitTransaction();
      return result;

    } catch (error) {

      // Revertir cambios en caso de error
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Crea un usuario genera su token JWT.
   * @param manager - EntityManager asociado a la transacción.
   * @param email - Email del nuevo usuario.
   * @param password - Contraseña
   * @param role - Rol asignado al usuario.
   * @returns Objeto con `user` creado y `token` JWT.
   */
  private async createUserWithToken(
    manager: EntityManager,
    email: string,
    password: string,
    role: Role,
  ) {
    // Crear el usuario usando el manager de la transacción
    const user = await this.userService.createWithManager(
      manager,
      { email, password, role, isActive: true },
    );

    // Generar token para el nuevo usuario
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

}