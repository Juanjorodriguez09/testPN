import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';
import { User } from './entities/user.entity';
import { EntityManager, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from './dto/user-response.dto';
import { MSG } from '../common/helpers/validation-messages.helper';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { paginate } from '../common/helpers/paginate.helper';

@Injectable()
export class UserService {

  constructor(
    private readonly hasher: BcryptAdapter,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Crea un nuevo usuario.
   * @param createUserDto - Datos del usuario.
   * @returns La entidad `User` creada.
   */
  async create(createUserDto: CreateUserDto) {
    // Usa el manager por defecto; útil para operaciones en transacciones
    return this.createWithManager(this.userRepository.manager, createUserDto);
  }

  /**
   * Crea un usuario usando el `EntityManager` (permite transacciones).
   * Hashea la contraseña antes de persistir.
   * @param manager - EntityManager de la transacción.
   * @param createUserDto - Datos del usuario.
   * @returns La entidad `User` creada.
   */
  async createWithManager(manager: EntityManager, createUserDto: CreateUserDto) {
    // Verificar que no exista ya un usuario con el mismo email
    const existingUser = await manager.existsBy(User, { email: createUserDto.email });
    if (existingUser) throw new ConflictException(MSG.unique('correo electrónico'));

    // Hash de la contraseña antes de persistir
    const hashedPassword = await this.hasher.hash(createUserDto.password);

    const user = manager.create(User, { ...createUserDto, password: hashedPassword });
    return manager.save(user);
  }

  /**
   * Obtiene usuarios paginados y los transforma a `UserResponseDto`.
   * @param pagination - Parámetros de paginación.
   * @returns Respuesta paginada con `UserResponseDto`.
   */
  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<UserResponseDto>> {
    const result = await paginate(this.userRepository, pagination, {});

    return {
      ...result,
      data: result.data.map((user) => new UserResponseDto(user)),
    };
  }

  /**
   * Busca un usuario por id y lo transforma a `UserResponseDto`.
   * @param id - Identificador del usuario (string UUID).
   * @returns `UserResponseDto` con datos públicos del usuario.
   * @throws NotFoundException si no existe.
   */
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(MSG.notFoundById('usuario'));

    return new UserResponseDto(user);
  }

  /**
   * Actualiza un usuario existente.
   * Hashea la nueva contraseña si se provee y valida unicidad de email.
   * @param id - Identificador del usuario a actualizar.
   * @param updateUserDto - Datos a actualizar.
   * @returns La entidad `User` actualizada.
   * @throws NotFoundException si no existe el usuario.
   */
  async update(id: string, updateUserDto: UpdateUserDto) {

    // Hashear contraseña si se está actualizando
    if (updateUserDto.password) {
      updateUserDto.password = await this.hasher.hash(updateUserDto.password);
    }

    // Verificar que el usuario existe
    const user = await this.userRepository.preload({ id, ...updateUserDto });
    if (!user) throw new NotFoundException(MSG.notFoundById('usuario'));

    // Validar unicidad del email ignorando el usuario actual
    if (updateUserDto.email) {
      const emailTaken = await this.userRepository.existsBy({
        email: updateUserDto.email,
        id   : Not(id),
      });

      if (emailTaken) throw new ConflictException(MSG.unique('correo electrónico'));
    }

    // Guardar los cambios y devolver la entidad actualizada
    return this.userRepository.save(user);
  }

  /**
   * Elimina (soft remove) un usuario por id.
   * @param id - Identificador del usuario.
   * @returns Promise<void>.
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
  }

  /**
   * Busca un usuario por email incluyendo el campo `password`.
   * Utilizado por flujos de autenticación donde se debe comparar la contraseña.
   * @param email - Email del usuario.
   * @returns `User` con password seleccionado o `null` si no existe.
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    // Obtener el usuario incluyendo la contraseña (no seleccionada por defecto)
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

}

