import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { UniversityModule } from '../university/university.module';
import { CommonModule } from '../common/common.module';
import { StudentFilterBuilder } from './filters/student-filter.builder';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Student ]),
    UniversityModule,
    CommonModule
  ],
  exports: [
    StudentService,
    TypeOrmModule
  ],
  controllers: [StudentController],
  providers: [StudentService, StudentFilterBuilder],
})
export class StudentModule {}
