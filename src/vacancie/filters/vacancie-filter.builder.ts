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

    return queryBuilder;

  }

}