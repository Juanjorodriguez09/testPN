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
   * @param pagination - Parámetros de paginación.
   * @returns Respuesta paginada con entidades `University`.
   */
  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<University>> {
    const result = await paginate(this.universityRepository, pagination, {});

    return {
      ...result,
      data: result.data,
    };
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
    // Preload y verificación de existencia
    const university = await this.universityRepository.preload({id, ...updateUniversityDto});
    if (!university) 
      throw new NotFoundException(MSG.notFoundById('universidad'));

    // Validar unicidad del nit ignorando el registro actual
    if (updateUniversityDto.nit) {
      const nitTaken = await this.universityRepository.existsBy({
        nit : updateUniversityDto.nit,
        id  : Not(id),
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
