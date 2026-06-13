import { Module } from '@nestjs/common';
import { InternshipService } from './internship.service';
import { InternshipController } from './internship.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Internship } from './entities/internship.entity';
import { CommonModule } from '../common/common.module';
import { ApplicationModule } from '../application/application.module';
import { InternshipFilterBuilder } from './filters/internship-filter.builder';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Internship ]),
    CommonModule,
    ApplicationModule
  ],
  controllers: [InternshipController],
  providers: [InternshipService, InternshipFilterBuilder],
  exports: [
    TypeOrmModule
  ]
})
export class InternshipModule {}
