import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { StudentModule } from '../student/student.module';
import { VacancieModule } from '../vacancie/vacancie.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Application ]),
    StudentModule,
    VacancieModule
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService],
  exports: [
    TypeOrmModule
  ]
})
export class ApplicationModule {}
