import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { MSG } from '../common/helpers/validation-messages.helper';
import { User } from '../user/entities/user.entity';
import { UniversityFiltersDto } from './dto/university-filters.dto';
import { CommonService } from '../common/common.service';
import { UniversityFilterBuilder } from './filters/university-filter.builder';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';

@Injectable()
export class UniversityService {

  constructor(
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
    private readonly commonService: CommonService,
    private readonly filterBuilder: UniversityFilterBuilder,
    private readonly dataSource: DataSource,
    private readonly hasher: BcryptAdapter,
  ) {}

  /**
   * Crea una nueva universidad y la asocia a un usuario.
   * @param createUniversityDto - Datos de la universidad.
   * @param user - Usuario propietario.
   * @returns La entidad `University` creada.
   */
  async create(createUniversityDto: CreateUniversityDto, user: User) {
    return this.createWithManager(this.universityRepository.manager, createUniversityDto, user);
  }

  /**
   * Crea una universidad usando el `EntityManager` (soporta transacciones).
   * @param manager - EntityManager de la transacción.
   * @param createUniversityDto - Datos de la universidad.
   * @param user - Usuario propietario.
   * @returns La entidad `University` persistida.
   */
  async createWithManager(manager: EntityManager, createUniversityDto: CreateUniversityDto, user: User) {
    // Verificar unicidad del NIT
    const exists = await manager.existsBy(University, {
      nit: createUniversityDto.nit
    });

    if (exists) throw new ConflictException( MSG.unique('NIT') );

    // Crear y persistir la entidad universidad
    const university = manager.create(University, { ...createUniversityDto, user });
    return manager.save(university);
  }

  /**
   * Obtiene universidades paginadas.
   * @param filters - Filtros.
   * @returns Respuesta paginada con entidades `University`.
   */
  async findAll(filters: UniversityFiltersDto): Promise<PaginatedResponse<University>|University[]> {
    
    let queryBuilder = this.universityRepository.createQueryBuilder('university');

    queryBuilder = this.filterBuilder.apply(queryBuilder, filters);

    return this.commonService.paginate(queryBuilder, filters);

  }

  /**
   * Busca una universidad por id.
   * @param id - Identificador numérico de la universidad.
   * @returns La entidad `University` encontrada.
   * @throws NotFoundException si no existe.
   */
  async findOne(id: number) {
    // Buscar universidad por id; lanzar NotFound si no existe
    const university = await this.universityRepository.findOneBy({ id });
    if (!university) throw new NotFoundException(MSG.notFoundById('universidad'));

    return university;
  }

  /**
   * Actualiza una universidad existente.
   * @param id - Identificador de la universidad a actualizar.
   * @param updateUniversityDto - Datos a actualizar.
   * @returns La entidad `University` actualizada.
   * @throws NotFoundException si no existe.
   */
  async update(id: number, updateUniversityDto: UpdateUniversityDto) {

    const { password, ...updateUniversityData } = updateUniversityDto;

    return this.withTransaction(async (manager) => {

      // Preload y verificación de existencia
      const university = await manager.preload(University, {id, ...updateUniversityData});
      if (!university) 
        throw new NotFoundException(MSG.notFoundById('universidad'));

      if (password) {
        const hashedPassword = await this.hasher.hash(password);
        const user = await manager.preload(User, { id: university.userId, password: hashedPassword });
        if (!user) throw new NotFoundException(MSG.notFoundById('usuario'));
        manager.save(user);
      }

      return manager.save(university);
    });
  }

  /**
   * Elimina (soft remove) una universidad por id.
   * @param id - Identificador de la universidad.
   */
  async remove(id: number) {
    const university = await this.findOne(id);
    await this.universityRepository.softRemove(university);
  }

  /**
   * Ejecuta una operación dentro de una transacción de TypeORM.
   * @param operation - Función que recibe un `EntityManager` y realiza operaciones sobre la BD.
   * @returns El resultado de la operación ejecutada dentro de la transacción.
   * @throws Re-lanza cualquier error ocurrido durante la operación tras hacer rollback.
   */
  private async withTransaction<T>(operation: (manager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {

      // Ejecutar la operación pasando el EntityManager de la transacción
      const result = await operation(queryRunner.manager);
      // Confirmar la transacción si todo salió bien
      await queryRunner.commitTransaction();
      return result;

    } catch (error) {

      // Revertir cambios en caso de error
      await queryRunner.rollbackTransaction();
      throw error;

    } finally {
      await queryRunner.release();
    }
  }
}
