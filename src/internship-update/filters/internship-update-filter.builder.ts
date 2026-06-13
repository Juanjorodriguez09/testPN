import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { InternshipUpdateFiltersDto } from '../dto/internship-update-filters.dto';
import { InternshipUpdate } from '../entities/internship-update.entity';
import { FilterBuilder } from '../../common/interfaces/filter-builder.interface';

@Injectable()
export class InternshipUpdateFilterBuilder implements FilterBuilder<InternshipUpdate, InternshipUpdateFiltersDto> {

  apply( queryBuilder: SelectQueryBuilder<InternshipUpdate>, filters: InternshipUpdateFiltersDto ): SelectQueryBuilder<InternshipUpdate> {

    queryBuilder.leftJoinAndSelect(
        'internshipUpdate.internship',
        'internship',
    );

    if (filters.internshipId) {

        queryBuilder.andWhere(
            'internship.id = :internshipId', {
                internshipId: filters.internshipId,
            },
        );
    }

    return queryBuilder;

  }

}