import { Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityController } from './university.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './entities/university.entity';
import { CommonModule } from '../common/common.module';
import { UniversityFilterBuilder } from './filters/university-filter.builder';

@Module({
  imports: [
    TypeOrmModule.forFeature([ University ]),
    CommonModule
  ],
  exports: [
    UniversityService,
    TypeOrmModule
  ],
  controllers: [UniversityController],
  providers: [UniversityService, UniversityFilterBuilder],
})
export class UniversityModule {}
