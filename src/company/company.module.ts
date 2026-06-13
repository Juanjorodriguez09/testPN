import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { CommonModule } from '../common/common.module';
import { BcryptAdapter } from '../common/adapters/bcrypt.adapter';
import { CompanyFilterBuilder } from './filters/company-filter.builder';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Company ]),
    CommonModule
  ],
  exports: [
    CompanyService,
    TypeOrmModule
  ],
  controllers: [CompanyController],
  providers: [CompanyService, BcryptAdapter, CompanyFilterBuilder],
})
export class CompanyModule {}
