import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { MSG } from '../common/helpers/validation-messages.helper';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { UniversityService } from '../university/university.service';
import { CommonService } from '../common/common.service';
import { StudentFilterBuilder } from './filters/student-filter.builder';
import { StudentFiltersDto } from './dto/student-filters.dto';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';
import { AssignSkillDto } from '../skill/dto/assign-skill.dto';
import { Skill } from '../skill/entities/skill.entity';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly universityService: UniversityService,
    private readonly commonService: CommonService,
    private readonly filterBuilder: StudentFilterBuilder,
    private readonly dataSource: DataSource,
    private readonly hasher: BcryptAdapter,
    @InjectRepository(Skill)
    private readonly skillRepository: Repository<Skill>
  ) {}

  /**
   * Crea un nuevo estudiante y lo asocia a un usuario y universidad.
   * @param createStudentDto - Datos del estudiante a crear.
   * @param user - Usuario propietario.
   * @returns La entidad `Student` creada.
   */
  async create(createStudentDto: CreateStudentDto, user: User) {
    return this.createWithManager(this.studentRepository.manager, createStudentDto, user);
  }

  /**
   * Crea un estudiante usando el `EntityManager` dado (permite transacciones).
   * @param manager - EntityManager de la transacción.
   * @param createStudentDto - Datos del estudiante.
   * @param user - Usuario propietario.
   * @returns La entidad `Student` persistida.
   */
  async createWithManager(manager: EntityManager, createStudentDto: CreateStudentDto, user: User) {
    // Comprobar si el número de documento ya pertenece a otro estudiante
    const exists = await manager.existsBy(Student, {
      documentNumber: createStudentDto.documentNumber
    });

    if (exists) throw new ConflictException( MSG.unique('número de documento') );

    // Obtener la universidad relacionada (lanza NotFound si no existe)
    const university = await this.universityService.findOne(createStudentDto.universityId);

    // Crear y persistir la entidad estudiante
    const student = manager.create(Student, { ...createStudentDto, university, user });
    return manager.save(student);
  }

  /**
   * Obtiene estudiantes paginados.
   * @param filters - Filtros.
   * @returns Respuesta paginada con entidades `Student`.
   */
  async findAll(filters: StudentFiltersDto): Promise<PaginatedResponse<Student>|Student[]> {
    
    let queryBuilder = this.studentRepository.createQueryBuilder('student');

    queryBuilder = this.filterBuilder.apply(queryBuilder, filters);

    return this.commonService.paginate(queryBuilder, filters)
  }

  /**
   * Busca un estudiante por id.
   * @param id - Identificador numérico del estudiante.
   * @returns La entidad `Student` encontrada.
   * @throws NotFoundException si no existe.
   */
  async findOne(id: number) {
    // Buscar estudiante por id y lanzar excepción si no existe
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) throw new NotFoundException(MSG.notFoundById('estudiante'));

    return student;
  }

  /**
   * Actualiza un estudiante existente.
   * @param id - Identificador del estudiante a actualizar.
   * @param updateStudentDto - Datos a actualizar.
   * @returns La entidad `Student` actualizada.
   * @throws NotFoundException si no existe.
   */
  async update(id: number, updateStudentDto: UpdateStudentDto) {

    const { password, ...updateStudentData } = updateStudentDto;
    
    return this.withTransaction(async (manager) => {

      // Preload y verificación de existencia
      const student = await manager.preload(Student, {id, ...updateStudentData});
      if (!student) 
        throw new NotFoundException(MSG.notFoundById('estudiante'));

      if (password) {
        const hashedPassword = await this.hasher.hash(password);
        const user = await manager.preload(User, { id: student.userId, password: hashedPassword });
        if (!user) throw new NotFoundException(MSG.notFoundById('usuario'));
        manager.save(user);
      }

      return manager.save(student);
    });
  }

  /**
   * Elimina (soft remove) un estudiante por id.
   * @param id - Identificador del estudiante.
   */
  async remove(id: number) {
    const student = await this.findOne(id);
    await this.studentRepository.softRemove(student);
  }

  /**
   * Le asigna una habilidad a un estudiante
   * 
   * @param {number} id 
   * @param {AssignSkillDto} assignSkillDto 
   * @returns 
   */
  async assignSkills(id: number, assignSkillDto: AssignSkillDto) {
    const student = await this.studentRepository.findOne({
      where: { id },
      relations: {
        skills: true,
      },
    });

    if (!student) throw new NotFoundException(MSG.notFoundById('estudiante'));

    const skill = await this.skillRepository.findOneBy({id: assignSkillDto.skillId});

    if (!skill) throw new NotFoundException(MSG.notFoundById('habilidad'));

    const alreadyExists = student.skills?.some(
      skill => skill.id === assignSkillDto.skillId,
    );

    if (alreadyExists) throw new ConflictException(MSG.alreadyAsiggn('habilidad'));

    student.skills?.push(skill);

    return this.studentRepository.save(student);
  }

  /**
   * Elimina una habilidad de un estudiante
   * 
   * @param {number} id 
   * @param {number} skillId 
   */
  async removeSkill(id: number, skillId: number) {
    await this.dataSource.createQueryBuilder()
      .relation(Student, 'skills')
      .of(id)
      .remove(skillId);
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
