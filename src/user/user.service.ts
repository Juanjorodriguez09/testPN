import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
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
   * 
   * @param createUserDto 
   * @returns 
   */
  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const exists = await this.userRepository.existsBy({
      email: createUserDto.email
    });
    
    if (exists) {
      throw new ConflictException(MSG.unique('correo electrónico'));
    }
 
    const hashedPassword = await this.hasher.hash(createUserDto.password);
 
    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
 
    const saved = await this.userRepository.save(user);
    return new UserResponseDto(saved);
  }

  /**
   * 
   * @returns 
   */
  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<UserResponseDto>> {
    const result = await paginate(this.userRepository, pagination, {});

    return {
      ...result,
      data: result.data.map((user) => new UserResponseDto(user)),
    };
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(MSG.notFoundById('usuario'));

    return new UserResponseDto(user);
  }

  /**
   * 
   * @param id 
   * @param updateUserDto 
   * @returns 
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

    return this.userRepository.save(user);
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.softRemove(user);
  }

  /**
   * 
   * @param email 
   * @returns 
   */
  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

}

