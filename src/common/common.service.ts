import { Injectable, NotFoundException } from '@nestjs/common';
import { CONSTANTS_REGISTRY } from './constants.registry';
import { MSG } from './helpers/validation-messages.helper';
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from './dto/pagination.dto';
import { PaginatedResponse } from './interfaces/paginated-response.interface';

@Injectable()
export class CommonService {

  /**
   * Recupera los valores de un enum/constante por su clave en el registro.
   * @param constantName - Nombre de la constante registrada en `CONSTANTS_REGISTRY`.
   * @returns Lista de valores como `string[]`.
   * @throws NotFoundException si la constante no existe.
   */
  getValues(constantName: string): string[] {
    // Buscar el objeto registrado por nombre
    const enumObject = CONSTANTS_REGISTRY[constantName];

    if (!enumObject) {
      // Lanzar excepción clara si no se encuentra
      throw new NotFoundException(
        MSG.notFound(constantName),
      );
    }

    // Devolver solo los valores del objeto
    return Object.values(enumObject);
  }

  /**
   * Devuelve los registros paginados
   * 
   * @param queryBuilder 
   * @param paginationDto 
   * @returns 
   */
  async paginate<T extends ObjectLiteral>( queryBuilder: SelectQueryBuilder<T>, paginationDto: PaginationDto ): Promise<PaginatedResponse<T>|T[]> {

    // Ordena de manera descendente
    queryBuilder.orderBy(
      `${queryBuilder.alias}.createdAt`,
      'DESC',
    );

    // Obtiene todos los registros sin paginar si lo solicita el cliente
    if (paginationDto.all) {
      return queryBuilder.getMany();
    }

    const page = paginationDto.page;
    const per_page = paginationDto.per_page;

    queryBuilder.skip( 
      (page - 1) * per_page,
    );

    queryBuilder.take(per_page);

    const [data, total] =
      await queryBuilder.getManyAndCount();

    const page_count = Math.ceil(total / per_page);

    return {
      data,
      total,
      page,
      per_page,
      page_count,
      has_next: page < page_count,
      has_prev: page > 1,
    };

  }
}