import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVacancieDto } from './dto/create-vacancie.dto';
import { UpdateVacancieDto } from './dto/update-vacancie.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vacancie } from './entities/vacancie.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { paginate } from '../common/helpers/paginate.helper';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { CompanyService } from '../company/company.service';
import { MSG } from '../common/helpers/validation-messages.helper';

@Injectable()
export class VacancieService {

  constructor(
    @InjectRepository(Vacancie)
    private readonly vacancieRepository: Repository<Vacancie>,
    private readonly companyService: CompanyService
  ) {}

  async create(createVacancieDto: CreateVacancieDto) {
    
    const company = await this.companyService.findOne(createVacancieDto.companyId);

    const vacancie = this.vacancieRepository.create({
      ...createVacancieDto,
      company
    });

    return this.vacancieRepository.save(vacancie);

  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<Vacancie>> {
    const result = await paginate(this.vacancieRepository, pagination, {});

    return {
      ...result,
      data: result.data,
    };
  }

  async findOne(id: number) {
    const vacancie = await this.vacancieRepository.findOneBy({ id });
    if (!vacancie) throw new NotFoundException(MSG.notFoundById('vacante'));

    return vacancie;
  }

  async update(id: number, updateVacancieDto: UpdateVacancieDto) {

    // Valida existencia de la empresa
    if (updateVacancieDto.companyId) {
      await this.companyService.findOne(updateVacancieDto.companyId);
    }
    
    const vacancie = await this.vacancieRepository.preload({ id, ...updateVacancieDto });
    if (!vacancie) throw new NotFoundException(MSG.notFoundById('vacante'));

    return this.vacancieRepository.save(vacancie);
  }

  async remove(id: number) {
    const vacancie = await this.findOne(id);
    await this.vacancieRepository.softRemove(vacancie);
  }
}
