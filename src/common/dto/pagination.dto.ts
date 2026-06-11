import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, Max, Min } from 'class-validator';
import { MSG } from '../helpers/validation-messages.helper';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: MSG.isInt('page') })
  @Min(1,  { message: MSG.min('page', 1) })
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: MSG.isInt('per_page') })
  @Min(1,   { message: MSG.min('per_page', 1) })
  @Max(100, { message: MSG.max('per_page', 100) })
  per_page: number = 10;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  all = false;
}