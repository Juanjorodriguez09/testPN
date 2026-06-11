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
import { VacancieFiltersDto } from './dto/vacancie-filters.dto';
import { VacancieFilterBuilder } from './filters/vacancie-filter.builder';
import { CommonService } from '../common/common.service';

@Injectable()
export class VacancieService {

  constructor(
    @InjectRepository(Vacancie)
    private readonly vacancieRepository: Repository<Vacancie>,
    private readonly companyService: CompanyService,
    private readonly commonService: CommonService,
    private readonly filterBuilder: VacancieFilterBuilder,
  ) {}

  /**
   * Crea una nueva vacante asociada a una empresa.
   * @param createVacancieDto - Datos de la vacante (incluye `companyId`).
   * @returns La entidad `Vacancie` creada.
   */
  async create(createVacancieDto: CreateVacancieDto) {
    // Obtener la empresa relacionada; `findOne` lanzará NotFound si no existe
    const company = await this.companyService.findOne(createVacancieDto.companyId);

    // Crear la entidad vacante con la relación asignada
    const vacancie = this.vacancieRepository.create({
      ...createVacancieDto,
      company
    });

    return this.vacancieRepository.save(vacancie);

  }

  /**
   * Obtiene vacantes paginadas.
   * @param filters - Filtros.
   * @returns Respuesta paginada con entidades `Vacancie`.
   */
  async findAll(filters: VacancieFiltersDto): Promise<PaginatedResponse<Vacancie>|Vacancie[]> {

    let queryBuilder = this.vacancieRepository.createQueryBuilder('vacancie');

    queryBuilder = this.filterBuilder.apply(queryBuilder, filters);

    return this.commonService.paginate(queryBuilder, filters)
  }

  /**
   * Busca una vacante por id.
   * @param id - Identificador numérico de la vacante.
   * @returns La entidad `Vacancie` encontrada.
   * @throws NotFoundException si no existe.
   */
  async findOne(id: number) {
    const vacancie = await this.vacancieRepository.findOneBy({ id });
    if (!vacancie) throw new NotFoundException(MSG.notFoundById('vacante'));

    return vacancie;
  }

  /**
   * Actualiza una vacante.
   * @param id - Identificador de la vacante a actualizar.
   * @param updateVacancieDto - Datos a actualizar (puede incluir `companyId`).
   * @returns La entidad `Vacancie` actualizada.
   * @throws NotFoundException si no existe la vacante.
   */
  async update(id: number, updateVacancieDto: UpdateVacancieDto) {
    const { companyId, ...vacancieData } = updateVacancieDto;

    // Valida existencia de la empresa y obtiene la entidad
    const company = companyId
      ? await this.companyService.findOne(companyId)
      : undefined;

    const vacancie = await this.vacancieRepository.preload({ id, ...vacancieData });
    if (!vacancie) throw new NotFoundException(MSG.notFoundById('vacante'));

    // Asigna la relación como objeto
    if (company) vacancie.company = company;

    return this.vacancieRepository.save(vacancie);
  }

  /**
   * Elimina (soft remove) una vacante por id.
   * @param id - Identificador de la vacante.
   */
  async remove(id: number) {
    const vacancie = await this.findOne(id);
    await this.vacancieRepository.softRemove(vacancie);
  }
}
