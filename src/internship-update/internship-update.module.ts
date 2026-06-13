import { Module } from '@nestjs/common';
import { InternshipUpdateService } from './internship-update.service';
import { InternshipUpdateController } from './internship-update.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternshipUpdate } from './entities/internship-update.entity';
import { CommonModule } from '../common/common.module';
import { InternshipModule } from '../internship/internship.module';
import { InternshipUpdateFilterBuilder } from './filters/internship-update-filter.builder';

@Module({
  imports: [
    TypeOrmModule.forFeature([ InternshipUpdate ]),
    CommonModule,
    InternshipModule,
  ],
  controllers: [InternshipUpdateController],
  providers: [InternshipUpdateService, InternshipUpdateFilterBuilder],
  exports: [
    TypeOrmModule
  ]
})
export class InternshipUpdateModule {}
