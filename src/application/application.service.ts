import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { Application } from './entities/application.entity';
import { paginate } from '../common/helpers/paginate.helper';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MSG } from '../common/helpers/validation-messages.helper';
import { StudentService } from '../student/student.service';
import { VacancieService } from '../vacancie/vacancie.service';
import { CommonService } from '../common/common.service';
import { ApplicationFiltersDto } from './dto/application-filters.dto';
import { ApplicationFilterBuilder } from './filters/application-filter.builder';

@Injectable()
export class ApplicationService {

  constructor(
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly studentService: StudentService,
    private readonly vacancieService: VacancieService,
    private readonly commonService: CommonService,
    private readonly filterBuilder: ApplicationFilterBuilder,
  ) {}

  /**
   * Crea una nueva postulación.
   * @param createApplicationDto - Datos de la postulación.
   * @returns La entidad `Application` creada.
   */
  async create(vacancieId: number, createApplicationDto: CreateApplicationDto) {
    const { studentId, ...applicationData } = createApplicationDto;

    // Valida existencia de estudiante y postulación
    const [ student, vacancie ] = await Promise.all([
      this.studentService.findOne(studentId),
      this.vacancieService.findOne(vacancieId)
    ])

    // Crear la entidad postulación con las relaciones asignadas
    const application = this.applicationRepository.create({
      ...applicationData,
      student,
      vacancie
    });

    return this.applicationRepository.save(application);
  }

  /**
   * Obtiene postulaciones paginadas.
   * @param filters - Filtros.
   * @returns Respuesta paginada con entidades `Application`.
   */
  async findAll(filters: ApplicationFiltersDto): Promise<PaginatedResponse<Application>|Application[]> {
    
    let queryBuilder = this.applicationRepository.createQueryBuilder('application');

    queryBuilder = this.filterBuilder.apply(queryBuilder, filters);

    return this.commonService.paginate(queryBuilder, filters)

  }

  /**
   * Busca una postulación por id.
   * @param id - Identificador numérico de la postulación.
   * @returns La entidad `Application` encontrada.
   * @throws NotFoundException si no existe.
   */
  async findOne(id: number) {
    const application = await this.applicationRepository.findOneBy({ id });
    if (!application) throw new NotFoundException(MSG.notFoundById('postulación'));

    return application;
  }

  /**
   * Actualiza una postulación.
   * @param id - Identificador de la postulación a actualizar.
   * @param updateApplicationDto - Datos a actualizar.
   * @returns La entidad `Application` actualizada.
   * @throws NotFoundException si no existe la postulación.
   */
  async update(id: number, updateApplicationDto: UpdateApplicationDto) {

    const application = await this.applicationRepository.preload({ id, ...updateApplicationDto }); 
    if (!application) throw new NotFoundException(MSG.notFoundById('postulación'));

    return this.applicationRepository.save(application);
  }

  /**
   * Elimina (soft remove) una postulación por id.
   * @param id - Identificador de la postulación.
   */
  async remove(id: number) {
    const application = await this.findOne(id);
    await this.applicationRepository.softRemove(application);
  }
}
