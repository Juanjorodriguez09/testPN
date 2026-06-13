import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Not, Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { User } from '../user/entities/user.entity';
import { MSG } from '../common/helpers/validation-messages.helper';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';
import { CommonService } from '../common/common.service';
import { CompanyFilterBuilder } from './filters/company-filter.builder';
import { CompanyFiltersDto } from './dto/company-filters.dto';

@Injectable()
export class CompanyService {

  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly dataSource: DataSource,
    private readonly hasher: BcryptAdapter,
    private readonly commonService: CommonService,
    private readonly filterBuilder: CompanyFilterBuilder,
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
   * @param filters - Filtros.
   * @returns Respuesta paginada con entidades `Company`.
   */
  async findAll(filters: CompanyFiltersDto): Promise<PaginatedResponse<Company>|Company[]> {

    let queryBuilder = this.companyRepository.createQueryBuilder('company');

    queryBuilder = this.filterBuilder.apply(queryBuilder, filters);

    return this.commonService.paginate(queryBuilder, filters);
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
    
    const { password, ...updateCompanyData } = updateCompanyDto;
    
    return this.withTransaction(async (manager) => {

      // Preload y verificación de existencia
      const company = await manager.preload(Company, {id, ...updateCompanyData});
      if (!company) 
        throw new NotFoundException(MSG.notFoundById('empresa'));

      if (password) {
        const hashedPassword = await this.hasher.hash(password);
        const user = await manager.preload(User, { id: company.userId, password: hashedPassword });
        if (!user) throw new NotFoundException(MSG.notFoundById('usuario'));
        manager.save(user);
      }

      return manager.save(company);
    });

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
