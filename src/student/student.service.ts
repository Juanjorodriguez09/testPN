import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { EntityManager, Not, Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { MSG } from '../common/helpers/validation-messages.helper';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { paginate } from '../common/helpers/paginate.helper';
import { UniversityService } from '../university/university.service';

@Injectable()
export class StudentService {

  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
    private readonly universityService: UniversityService
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
   * @param pagination - Parámetros de paginación.
   * @returns Respuesta paginada con entidades `Student`.
   */
  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<Student>> {
    const result = await paginate(this.studentRepository, pagination, {});

    return {
      ...result,
      data: result.data,
    };
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
    // Cargar la entidad y aplicar cambios; si no existe, lanzar error
    const student = await this.studentRepository.preload({id, ...updateStudentDto});
    if (!student) 
      throw new NotFoundException(MSG.notFoundById('estudiante'));

    // Validar unicidad del documento de identidad ignorando el registro actual
    if (updateStudentDto.documentNumber) {
      const idNumberTaken = await this.studentRepository.existsBy({
        documentNumber : updateStudentDto.documentNumber,
        id             : Not(id),
      });

      if (idNumberTaken) throw new ConflictException(MSG.unique('número de documento'));
    }

    // Guardar y retornar
    return this.studentRepository.save(student);

  }

  async remove(id: number) {
    const student = await this.findOne(id);
    await this.studentRepository.softRemove(student);
  }
}
