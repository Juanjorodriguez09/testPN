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

  async create(createStudentDto: CreateStudentDto, user: User) {
    return this.createWithManager(this.studentRepository.manager, createStudentDto, user);
  }

  async createWithManager(manager: EntityManager, createStudentDto: CreateStudentDto, user: User) {

    const exists = await manager.existsBy(Student, {
      documentNumber: createStudentDto.documentNumber
    });

    if (exists) throw new ConflictException( MSG.unique('número de documento') );

    const university = await this.universityService.findOne(createStudentDto.universityId);

    const student = manager.create(Student, { ...createStudentDto, university, user });
    return manager.save(student);
  }

  async findAll(pagination: PaginationDto): Promise<PaginatedResponse<Student>> {
    const result = await paginate(this.studentRepository, pagination, {});

    return {
      ...result,
      data: result.data,
    };
  }

  async findOne(id: number) {
        
    const student = await this.studentRepository.findOneBy({ id });
    if (!student) throw new NotFoundException(MSG.notFoundById('estudiante'));

    return student;
  }

  async update(id: number, updateStudentDto: UpdateStudentDto) {
      
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

    return this.studentRepository.save(student);

  }

  async remove(id: number) {
    const student = await this.findOne(id);
    await this.studentRepository.softRemove(student);
  }
}
