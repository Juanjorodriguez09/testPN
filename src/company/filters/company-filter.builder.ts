import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { FilterBuilder } from '../../common/interfaces/filter-builder.interface';
import { Company } from '../entities/company.entity';
import { CompanyFiltersDto } from '../dto/company-filters.dto';

@Injectable()
export class CompanyFilterBuilder implements FilterBuilder<Company, CompanyFiltersDto> {

  apply( queryBuilder: SelectQueryBuilder<Company>, filters: CompanyFiltersDto ): SelectQueryBuilder<Company> {

    queryBuilder.leftJoinAndSelect(
        'company.user',
        'user',
    );

    return queryBuilder;

  }

}