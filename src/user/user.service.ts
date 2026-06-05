import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserResponseDto } from './dto/user-response.dto';

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
    const exists = await this.userRepository.findOneBy({
      email: createUserDto.email,
    });
    
    if (exists === null) {
      throw new ConflictException('Este correo ya está registrado');
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
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => new UserResponseDto(user));
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`No se encontró el elemento`);

    return new UserResponseDto(user);
  }

  /**
   * 
   * @param id 
   * @param updateUserDto 
   * @returns 
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hasher.hash(updateUserDto.password);
    }
    
    const user = await this.userRepository.preload({id, ...updateUserDto});
    if (!user) throw new NotFoundException(`No se encontró el elemento`);

    const updatedUser = await this.userRepository.save(user);
    
    return updatedUser;
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  async remove(id: string): Promise<boolean> {
    const user = await this.findOne(id);

    user.isActive = false;

    await this.userRepository.save(user);

    return true;
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

