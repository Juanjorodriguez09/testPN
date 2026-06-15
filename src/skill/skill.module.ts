import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillController } from './skill.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { CommonModule } from '../common/common.module';
import { SkillFilterBuilder } from './filters/skill-filter.builder';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Skill ]),
    CommonModule
  ],
  controllers: [SkillController],
  providers: [SkillService, SkillFilterBuilder],
  exports: [
    TypeOrmModule,
    SkillService
  ]
})
export class SkillModule {}
