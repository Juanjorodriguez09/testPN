import { Module } from '@nestjs/common';
import { VacancieService } from './vacancie.service';
import { VacancieController } from './vacancie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancie } from './entities/vacancie.entity';
import { CompanyModule } from '../company/company.module';
import { CommonModule } from '../common/common.module';
import { VacancieFilterBuilder } from './filters/vacancie-filter.builder';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Vacancie ]),
    CompanyModule,
    CommonModule
  ],
  controllers: [VacancieController],
  providers: [VacancieService, VacancieFilterBuilder],
  exports: [
    TypeOrmModule,
    VacancieService
  ]
})
export class VacancieModule {}
