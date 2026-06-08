import { Repository, FindManyOptions, ObjectLiteral } from 'typeorm';
import { PaginationDto } from '../dto/pagination.dto';
import { PaginatedResponse } from '../interfaces/paginated-response.interface';

export async function paginate<T extends ObjectLiteral>(
  repository : Repository<T>,
  pagination : PaginationDto,
  options    : FindManyOptions<T> = {},
): Promise<PaginatedResponse<T>> {
  const { page, per_page } = pagination;

  const [data, total] = await repository.findAndCount({
    ...options,
    order : { createdAt: 'DESC', ...options.order } as any,
    skip  : (page - 1) * per_page,
    take  : per_page,
  });

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