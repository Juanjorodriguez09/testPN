import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { FilterBuilder } from '../../common/interfaces/filter-builder.interface';
import { Skill } from '../entities/skill.entity';
import { SkillFiltersDto } from '../dto/skill-filters.dto';

@Injectable()
export class SkillFilterBuilder implements FilterBuilder<Skill, SkillFiltersDto> {

  apply( queryBuilder: SelectQueryBuilder<Skill>, filters: SkillFiltersDto ): SelectQueryBuilder<Skill> {

    return queryBuilder;

  }

}