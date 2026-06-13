import { Type } from "class-transformer";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class InternshipUpdateFiltersDto extends PaginationDto {

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    internshipId?: number;
}