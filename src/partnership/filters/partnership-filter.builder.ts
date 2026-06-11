import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { FilterBuilder } from '../../common/interfaces/filter-builder.interface';
import { Partnership } from '../entities/partnership.entity';
import { PartnershipFiltersDto } from '../dto/partnership-filters.dto';

@Injectable()
export class PartnershipFilterBuilder implements FilterBuilder<Partnership, PartnershipFiltersDto> {

  apply( queryBuilder: SelectQueryBuilder<Partnership>, filters: PartnershipFiltersDto ): SelectQueryBuilder<Partnership> {

    queryBuilder.leftJoinAndSelect(
        'partnership.university',
        'university',
    );

    queryBuilder.leftJoinAndSelect(
        'partnership.company',
        'company',
    );

    if (filters.universityId) {

        queryBuilder.andWhere(
            'university.id = :universityId', {
                universityId: filters.universityId,
            },
        );
    }

    if (filters.status) {

        queryBuilder.andWhere(
            'partnership.status = :status', {
                status: filters.status,
            },
        );
    }

    if (filters.companyId) {

        queryBuilder.andWhere(
            'company.id = :companyId', {
                companyId: filters.companyId,
            },
        );
    }

    return queryBuilder;

  }

}