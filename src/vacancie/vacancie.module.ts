import { Module } from '@nestjs/common';
import { VacancieService } from './vacancie.service';
import { VacancieController } from './vacancie.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vacancie } from './entities/vacancie.entity';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Vacancie ]),
    CompanyModule,
  ],
  controllers: [VacancieController],
  providers: [VacancieService],
  exports: [
    TypeOrmModule
  ]
})
export class VacancieModule {}
