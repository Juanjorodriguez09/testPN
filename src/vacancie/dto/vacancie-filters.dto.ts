import { Type } from "class-transformer";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsEnum, IsOptional } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { VacancieStatus } from "../enum/vacancie-status.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class VacancieFiltersDto extends PaginationDto {

    @ApiPropertyOptional({ example: 'Activa' })
    @IsOptional()
    @IsEnum(VacancieStatus, { message: MSG.notValidValue('estado') })
    status?: VacancieStatus;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    companyId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    notAppliedByStudentId?: number;
}