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

  /**
   * Crea una nueva `Company` usando el repository por defecto.
   * Delegamos a `createWithManager` para soportar transacciones.
   * @param createCompanyDto - Datos de la compañía a crear.
   * @param user - Usuario propietario de la compañía.
   * @returns La entidad `Company` creada.
   */
  async create(createCompanyDto: CreateCompanyDto, user: User) {
    return this.createWithManager(this.companyRepository.manager, createCompanyDto, user);
  }

  /**
   * Crea una `Company` usando el `EntityManager` provisto (útil en transacciones).
   * @param manager - EntityManager de la transacción.
   * @param createCompanyDto - Datos de la compañía.
   * @param user - Usuario propietario.
   * @returns La entidad `Company` persistida.
   */
  async createWithManager(manager: EntityManager, createCompanyDto: CreateCompanyDto, user: User) {
    // Verificar si ya existe una empresa con el mismo NIT
    const exists = await manager.existsBy(Company, {
      nit: createCompanyDto.nit
    });

    if (exists) throw new ConflictException( MSG.unique('NIT') );

    // Crear la entidad y persistir
    const company = manager.create(Company, { ...createCompanyDto, user });
    return manager.save(company);
  }

  /**
   * Obtiene una lista paginada de compañías.
   * @param pagination - Parámetros de paginación (página, limit, etc.).
   * @returns Respuesta paginada con entidades `Company`.
   */
  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<Company>> {
    const result = await paginate(this.companyRepository, pagination, {});

    return {
      ...result,
      data: result.data,
    };
  }

  /**
   * Busca una compañía por su id.
   * @param id - Identificador numérico de la compañía.
   * @returns La entidad `Company` encontrada.
   * @throws NotFoundException si no existe.
   */
  async findOne(id: number) {
    // Buscar por id; lanzar excepción si no existe
    const company = await this.companyRepository.findOneBy({ id });
    if (!company) throw new NotFoundException(MSG.notFoundById('empresa'));

    return company;
  }

  /**
   * Actualiza una compañía.
   * @param id - Identificador de la compañía a actualizar.
   * @param updateCompanyDto - Datos a actualizar.
   * @returns La entidad `Company` actualizada.
   * @throws NotFoundException si no existe la compañía.
   */
  async update(id: number, updateCompanyDto: UpdateCompanyDto) {
    // Preload permite aplicar cambios solo si el registro existe
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

    // Guardar y retornar la entidad actualizada
    return this.companyRepository.save(company);

  }

  /**
   * Elimina (soft remove) una compañía por id.
   * @param id - Identificador de la compañía.
   * @returns Promise<void>.
   */
  async remove(id: number) {
    const company = await this.findOne(id);
    await this.companyRepository.softRemove(company);
  }

}
