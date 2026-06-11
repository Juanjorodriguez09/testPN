import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { FilterBuilder } from '../../common/interfaces/filter-builder.interface';
import { University } from '../entities/university.entity';
import { UniversityFiltersDto } from '../dto/university-filters.dto';

@Injectable()
export class UniversityFilterBuilder implements FilterBuilder<University, UniversityFiltersDto> {

  apply( queryBuilder: SelectQueryBuilder<University>, filters: UniversityFiltersDto ): SelectQueryBuilder<University> {

    

    return queryBuilder;

  }

}