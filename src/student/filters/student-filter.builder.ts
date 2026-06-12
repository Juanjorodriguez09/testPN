import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';
import { FilterBuilder } from '../../common/interfaces/filter-builder.interface';
import { Student } from '../entities/student.entity';
import { StudentFiltersDto } from '../dto/student-filters.dto';

@Injectable()
export class StudentFilterBuilder implements FilterBuilder<Student, StudentFiltersDto> {

  apply( queryBuilder: SelectQueryBuilder<Student>, filters: StudentFiltersDto ): SelectQueryBuilder<Student> {

    queryBuilder.leftJoinAndSelect(
        'student.user',
        'user',
    );

    queryBuilder.leftJoinAndSelect(
        'student.university',
        'university',
    );

    if (filters.universityId) {

        queryBuilder.andWhere(
            'university.id = :universityId', {
                universityId: filters.universityId,
            },
        );
    }

    return queryBuilder;

  }

}