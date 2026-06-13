import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateInternshipUpdateDto } from './dto/create-internship-update.dto';
import { UpdateInternshipUpdateDto } from './dto/update-internship-update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { InternshipUpdate } from './entities/internship-update.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { InternshipUpdateFilterBuilder } from './filters/internship-update-filter.builder';
import { InternshipService } from '../internship/internship.service';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { InternshipUpdateFiltersDto } from './dto/internship-update-filters.dto';
import { MSG } from '../common/helpers/validation-messages.helper';

@Injectable()
export class InternshipUpdateService {

  constructor(
    @InjectRepository(InternshipUpdate)
    private readonly internshipUpdateRepository: Repository<InternshipUpdate>,
    private readonly commonService: CommonService,
    private readonly filterBuilder: InternshipUpdateFilterBuilder,
    private readonly internshipService: InternshipService
  ) {}

  /**
   * Crea una nueva actualización pasantía.
   * 
   * @param createInternshipUpdateDto - Datos de la actualización de pasantía.
   * @returns La entidad `InternshipUpdate` creada.
   */
  async create(createInternshipUpdateDto: CreateInternshipUpdateDto) {
    const { internshipId, ...internshipUpdateData } = createInternshipUpdateDto;

    // Valida existencia de la pasantía
    const internship = await this.internshipService.findOne(internshipId);

    // Crea la entidad actualización de pasantía con las relaciones asignadas
    const internshipUpdate = this.internshipUpdateRepository.create({
      ...internshipUpdateData,
      internship
    });

    return this.internshipUpdateRepository.save(internshipUpdate);
  }

  /**
   * Obtiene actualizaciones de pasantías paginadas.
   * 
   * @param filters - Filtros.
   * @returns Respuesta paginada con entidades `InternshipUpdate`.
   */
  async findAll(filters: InternshipUpdateFiltersDto): Promise<PaginatedResponse<InternshipUpdate>|InternshipUpdate[]> {

    let queryBuilder = this.internshipUpdateRepository.createQueryBuilder('internshipUpdate');

    queryBuilder = this.filterBuilder.apply(queryBuilder, filters);

    return this.commonService.paginate(queryBuilder, filters)
  }

  /**
   * Busca una actualización de pasantía por id.
   * 
   * @param id - Identificador numérico de la actualización de pasantía.
   * @returns La entidad `InternshipUpdate` encontrada.
   * @throws NotFoundException si no existe.
   */
  async findOne(id: number) {
    const internshipUpdate = await this.internshipUpdateRepository.findOneBy({ id });
    if (!internshipUpdate) throw new NotFoundException(MSG.notFoundById('actualización de pasantía'));

    return internshipUpdate;
  }

  /**
   * Actualiza una actualización de pasantía.
   * 
   * @param id - Identificador de la actualización de pasantía a actualizar.
   * @param updateInternshipUpdateDto - Datos a actualizar.
   * @returns La entidad `InternshipUpdate` actualizada.
   * @throws NotFoundException si no existe la actualización de pasantía.
   */
  async update(id: number, updateInternshipUpdateDto: UpdateInternshipUpdateDto) {
    const { internshipId, ...updateInternshipUpdateData } = updateInternshipUpdateDto;
    
    const internshipUpdate = await this.internshipUpdateRepository.preload({ id, ...updateInternshipUpdateData });
    if (!internshipUpdate) throw new NotFoundException(MSG.notFoundById('actualización de pasantía'));

    return this.internshipUpdateRepository.save(internshipUpdate);
  }

  /**
   * Elimina (soft remove) una actualización de pasantía por id.
   * 
   * @param id - Identificador de la actualización de pasantía.
   */
  async remove(id: number) {
    const internshipUpdate = await this.findOne(id);
    await this.internshipUpdateRepository.softRemove(internshipUpdate);
  }
}
