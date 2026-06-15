import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { FilterBuilder } from '../../common/interfaces/filter-builder.interface';
import { Vacancie } from '../entities/vacancie.entity';
import { VacancieFiltersDto } from '../dto/vacancie-filters.dto';
import { Application } from '../../application/entities/application.entity';
import { Student } from '../../student/entities/student.entity';
import { Partnership } from '../../partnership/entities/partnership.entity';
import { PartnershipStatus } from '../../partnership/enum/partnership-status.enum';


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

    
    if (filters.studentId) {
        // Filtra por coincidencia de habilidades con un estudiante
        queryBuilder.innerJoin('vacancie.skills', 'vacancieSkill')
            .innerJoin(
                'student_skills',
                'studentSkill',
                'studentSkill.skillId = vacancieSkill.id',
            )
            .andWhere(
                'studentSkill.studentId = :studentId',
                { studentId: filters.studentId },
            )
            .distinct(true);

        // Filtra por convenio establecido con la universidad de un estudiante
        const partnershipSubQuery = queryBuilder.subQuery()
            .select('partnership.companyId')
            .from(Student, 'student')
            .innerJoin(
                Partnership,
                'partnership',
                'partnership.universityId = student.universityId',
            )
            .where(
                'student.id = :studentId',
            )
            .andWhere(
                'partnership.status = :partnershipStatus',
            )
            .getQuery();

        queryBuilder.andWhere(
            `vacancie.companyId IN ${partnershipSubQuery}`,
        )
        .setParameter(
            'partnershipStatus',
            PartnershipStatus.Active,
        );
    }

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