import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { UniversityModule } from '../university/university.module';
import { CommonModule } from '../common/common.module';
import { StudentFilterBuilder } from './filters/student-filter.builder';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';
import { SkillModule } from '../skill/skill.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Student ]),
    UniversityModule,
    CommonModule,
    SkillModule
  ],
  exports: [
    StudentService,
    TypeOrmModule
  ],
  controllers: [StudentController],
  providers: [StudentService, StudentFilterBuilder, BcryptAdapter],
})
export class StudentModule {}
