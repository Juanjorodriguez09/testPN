import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

export interface FilterBuilder<
  Entity extends ObjectLiteral,
  Filters
> {

  apply(
    queryBuilder: SelectQueryBuilder<Entity>,
    filters: Filters,
  ): SelectQueryBuilder<Entity>;

}