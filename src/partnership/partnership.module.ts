import { Module } from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { PartnershipController } from './partnership.controller';
import { Partnership } from './entities/partnership.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyModule } from '../company/company.module';
import { CommonModule } from '../common/common.module';
import { UniversityModule } from '../university/university.module';
import { PartnershipFilterBuilder } from './filters/partnership-filter.builder';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Partnership ]),
    CompanyModule,
    UniversityModule,
    CommonModule
  ],
  controllers: [PartnershipController],
  providers: [PartnershipService, PartnershipFilterBuilder],
  exports: [
    TypeOrmModule
  ]
})
export class PartnershipModule {}
