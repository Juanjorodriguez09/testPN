import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Not, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { User } from '../user/entities/user.entity';
import { MSG } from '../common/helpers/validation-messages.helper';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { paginate } from '../common/helpers/paginate.helper';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>
  ) {}

  async create(createCompanyDto: CreateCompanyDto, user: User) {
    return this.createWithManager(this.companyRepository.manager, createCompanyDto, user);
  }

  async createWithManager(manager: EntityManager, createCompanyDto: CreateCompanyDto, user: User) {

    const exists = await manager.existsBy(Company, {
      nit: createCompanyDto.nit
    });

    if (exists) throw new ConflictException( MSG.unique('NIT') );

    const company = manager.create(Company, { ...createCompanyDto, user });
    return manager.save(company);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<Company>> {
    const result = await paginate(this.companyRepository, pagination, {});

    return {
      ...result,
      data: result.data,
    };
  }

  async findOne(id: number) {
      
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) throw new NotFoundException(MSG.notFoundById('empresa'));

    return company;
  }

  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
      
    const company = await this.companyRepository.preload({id, ...updateCompanyDto});
    if (!company) 
      throw new NotFoundException(MSG.notFoundById('empresa'));

    // Validar unicidad del nit ignorando el registro actual
    if (updateCompanyDto.nit) {
      const nitTaken = await this.companyRepository.existsBy({
        nit : updateCompanyDto.nit,
        id  : Not(id),
      });

      if (nitTaken) throw new ConflictException(MSG.unique('NIT'));
    }

    return this.companyRepository.save(company);

  }

  async remove(id: number) {
    const company = await this.findOne(id);
    await this.companyRepository.softRemove(company);
  }

}
