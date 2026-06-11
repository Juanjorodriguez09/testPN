import { Type } from "class-transformer";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsOptional } from "class-validator";

export class StudentFiltersDto extends PaginationDto {

    @IsOptional()
    @Type(() => Number)
    universityId?: number;

}