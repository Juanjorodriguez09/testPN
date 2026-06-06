import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { EntityManager, Not, Repository } from 'typeorm';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate } from '../common/helpers/paginate.helper';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { MSG } from '../common/helpers/validation-messages.helper';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UniversityService {

  constructor(
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>
  ) {}

  async create(createUniversityDto: CreateUniversityDto, user: User) {
    return this.createWithManager(this.universityRepository.manager, createUniversityDto, user);
  }

  async createWithManager(manager: EntityManager, createUniversityDto: CreateUniversityDto, user: User) {

    const exists = await manager.existsBy(University, {
      nit: createUniversityDto.nit
    });

    if (exists) throw new ConflictException( MSG.unique('NIT') );

    const university = manager.create(University, { ...createUniversityDto, user });
    return manager.save(university);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<University>> {
    const result = await paginate(this.universityRepository, pagination, {});

    return {
      ...result,
      data: result.data,
    };
  }

  async findOne(id: number) {
    
    const university = await this.universityRepository.findOneBy({ id });
    if (!university) throw new NotFoundException(MSG.notFoundById('universidad'));

    return university;
  }

  async update(id: number, updateUniversityDto: UpdateUniversityDto) {
    
    const university = await this.universityRepository.preload({id, ...updateUniversityDto});
    if (!university) 
      throw new NotFoundException(MSG.notFoundById('universidad'));

    // Validar unicidad del nit ignorando el registro actual
    if (updateUniversityDto.nit) {
      const nitTaken = await this.universityRepository.existsBy({
        nit: updateUniversityDto.nit,
        id   : Not(id),
      });

      if (nitTaken) throw new ConflictException(MSG.unique('NIT'));
    }

    return this.universityRepository.save(university);

  }

  async remove(id: number) {
    const university = await this.findOne(id);
    await this.universityRepository.softRemove(university);
  }
}
