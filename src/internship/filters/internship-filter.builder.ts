import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { InternshipFiltersDto } from '../dto/internship-filters.dto';
import { Internship } from '../entities/internship.entity';
import { FilterBuilder } from '../../common/interfaces/filter-builder.interface';

@Injectable()
export class InternshipFilterBuilder implements FilterBuilder<Internship, InternshipFiltersDto> {

  apply( queryBuilder: SelectQueryBuilder<Internship>, filters: InternshipFiltersDto ): SelectQueryBuilder<Internship> {

    queryBuilder.leftJoinAndSelect(
        'internship.application',
        'application',
    );

    queryBuilder.leftJoinAndSelect(
        'application.student',
        'student',
    );
    
    queryBuilder.leftJoinAndSelect(
        'application.vacancie',
        'vacancie',
    );

    queryBuilder.leftJoin(
        'vacancie.company',
        'company',
    );

    queryBuilder.leftJoin(
        'student.university',
        'university',
    );

    if (filters.applicationId) {

        queryBuilder.andWhere(
            'application.id = :applicationId', {
                applicationId: filters.applicationId,
            },
        );
    }

    if (filters.studentId) {

        queryBuilder.andWhere(
            'student.id = :studentId', {
                studentId: filters.studentId,
            },
        );
    }

    if (filters.universityId) {

        queryBuilder.andWhere(
            'university.id = :universityId', {
                universityId: filters.universityId,
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

    if (filters.status) {

        queryBuilder.andWhere(
            'internship.status = :status', {
                status: filters.status,
            },
        );
    }

    if (filters.startDate) {

        queryBuilder.andWhere(
            'internship.startDate >= :startDate', {
                startDate: filters.startDate,
            }
        );
    }

    if (filters.endDate) {

        queryBuilder.andWhere(
            'internship.endDate <= :endDate', {
                endDate: filters.endDate,
            }
        );
    }

    return queryBuilder;

  }

}