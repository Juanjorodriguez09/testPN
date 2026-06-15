import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { FilterBuilder } from '../../common/interfaces/filter-builder.interface';
import { Vacancie } from '../entities/vacancie.entity';
import { VacancieFiltersDto } from '../dto/vacancie-filters.dto';
import { Application } from '../../application/entities/application.entity';


@Injectable()
export class VacancieFilterBuilder implements FilterBuilder<Vacancie, VacancieFiltersDto> {

  apply( queryBuilder: SelectQueryBuilder<Vacancie>, filters: VacancieFiltersDto ): SelectQueryBuilder<Vacancie> {

    queryBuilder.leftJoinAndSelect(
        'vacancie.company',
        'company',
    );

    queryBuilder.leftJoinAndSelect(
        'vacancie.skills',
        'skills',
    );

    // Filtra para no mostrar las vacantes en las que el estudiante está ya postulado
    if (filters.notAppliedByStudentId) {

        const subQuery = queryBuilder.subQuery()
            .select('1')
            .from(Application, 'application')
            .where('application.vacancieId = vacancie.id')
            .andWhere(
                'application.studentId = :notAppliedByStudentId',
            )
            .getQuery();

        queryBuilder.andWhere(
            `NOT EXISTS ${subQuery}`, {
              notAppliedByStudentId: filters.notAppliedByStudentId,
            },
        );
    }

    if (filters.status) {

        queryBuilder.andWhere(
            'vacancie.status = :status', {
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

    if (filters.title) {

        queryBuilder.andWhere(
            'LOWER(vacancie.title) LIKE LOWER(:title)', {
                title: `%${filters.title}%`,
            },
        );
    }

    if (filters.salary) {

        queryBuilder.andWhere(
            'vacancie.salary >= :salary', {
                salary: filters.salary,
            },
        );
    }

    if (filters.location) {

        queryBuilder.andWhere(
            'LOWER(vacancie.location) LIKE LOWER(:location)', {
                location: `%${filters.location}%`,
            },
        );
    }

    if (filters.modality) {

        queryBuilder.andWhere(
            'vacancie.modality = :modality', {
                modality: filters.modality,
            },
        );
    }

    if (filters.industry) {

        queryBuilder.andWhere(
            'company.industry = :industry', {
                industry: filters.industry,
            },
        );
    }

    return queryBuilder;

  }

}