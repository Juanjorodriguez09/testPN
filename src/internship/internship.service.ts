import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Internship } from './entities/internship.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { InternshipFilterBuilder } from './filters/internship-filter.builder';
import { ApplicationService } from '../application/application.service';
import { InternshipFiltersDto } from './dto/internship-filters.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { MSG } from '../common/helpers/validation-messages.helper';

@Injectable()
export class InternshipService {

  constructor(
    @InjectRepository(Internship)
    private readonly internshipRepository: Repository<Internship>,
    private readonly applicationService: ApplicationService,
    private readonly commonService: CommonService,
    private readonly filterBuilder: InternshipFilterBuilder,
  ) {}

  /**
   * Crea una nueva pasantía.
   * 
   * @param createInternshipDto - Datos de la pasantía.
   * @returns La entidad `Internship` creada.
   */
  async create(createInternshipDto: CreateInternshipDto) {
    const { applicationId, ...internshipData } = createInternshipDto;

    // Valida existencia de la postulación
    const application = await this.applicationService.findOne(applicationId);

    // Crear la entidad pasantía con las relaciones asignadas
    const internship = this.internshipRepository.create({
      ...internshipData,
      application
    });

    return this.internshipRepository.save(internship);
  }

  /**
   * Obtiene pasantías paginadas.
   * 
   * @param filters - Filtros.
   * @returns Respuesta paginada con entidades `Internship`.
   */
  async findAll(filters: InternshipFiltersDto): Promise<PaginatedResponse<Internship>|Internship[]> {
    
    let queryBuilder = this.internshipRepository.createQueryBuilder('internship');

    queryBuilder = this.filterBuilder.apply(queryBuilder, filters);

    return this.commonService.paginate(queryBuilder, filters)
  }

  /**
   * Busca una pasantía por id.
   * 
   * @param id - Identificador numérico de la pasantía.
   * @returns La entidad `Internship` encontrada.
   * @throws NotFoundException si no existe.
   */
  async findOne(id: number) {
    const internship = await this.internshipRepository.findOneBy({ id });
    if (!internship) throw new NotFoundException(MSG.notFoundById('pasantía'));

    return internship;
  }

  /**
   * Actualiza una pasantía.
   * 
   * @param id - Identificador de la pasantía a actualizar.
   * @param updateInternshipDto - Datos a actualizar.
   * @returns La entidad `Internship` actualizada.
   * @throws NotFoundException si no existe la pasantía.
   */
  async update(id: number, updateInternshipDto: UpdateInternshipDto) {
    const { applicationId, ...updateInternshipData } = updateInternshipDto;

    const internship = await this.internshipRepository.preload({ id, ...updateInternshipData }); 
    if (!internship) throw new NotFoundException(MSG.notFoundById('pasantía'));

    return this.internshipRepository.save(internship);
  }

  /**
   * Elimina (soft remove) una pasantía por id.
   * 
   * @param id - Identificador de la pasantía.
   */
  async remove(id: number) {
    const internship = await this.findOne(id);
    await this.internshipRepository.softRemove(internship);
  }
}
