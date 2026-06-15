import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';
import { CommonService } from '../common/common.service';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { SkillFilterBuilder } from './filters/skill-filter.builder';
import { SkillFiltersDto } from './dto/skill-filters.dto';
import { MSG } from '../common/helpers/validation-messages.helper';

@Injectable()
export class SkillService {

  constructor(
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>,
    private readonly commonService: CommonService,
    private readonly filterBuilder: SkillFilterBuilder
  ) {}

  /**
   * Obtiene habilidades paginadas.
   * 
   * @param filters - Filtros.
   * @returns Respuesta paginada con entidades `Skill`.
   */
  async findAll(filters: SkillFiltersDto): Promise<PaginatedResponse<Skill>|Skill[]> {

    let queryBuilder = this.skillRepository.createQueryBuilder('skill');

    queryBuilder = this.filterBuilder.apply(queryBuilder, filters);

    return this.commonService.paginate(queryBuilder, filters)
  }

  /**
   * Busca una habilidad por id.
   * 
   * @param id - Identificador numérico de la habilidad.
   * @returns La entidad `Skill` encontrada.
   * @throws NotFoundException si no existe.
   */
  async findOne(id: number) {
    const skill = await this.skillRepository.findOneBy({ id });
    if (!skill) throw new NotFoundException(MSG.notFoundById('habilidad'));
    
    return skill;
  }

  /**
   * Elimina una habilidad por id.
   * 
   * @param id - Identificador de la habilidad.
   */
  async remove(id: number) {
    const skill = await this.findOne(id);

    // Valida que no tenga registros asociados
    if (skill.students) throw new ConflictException(MSG.cannotDelete('habilidad'))
    if (skill.vacancies) throw new ConflictException(MSG.cannotDelete('habilidad'))

    await this.skillRepository.remove(skill);
  }
}
