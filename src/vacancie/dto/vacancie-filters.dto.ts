import { Type } from "class-transformer";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsEnum, IsOptional } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { VacancieStatus } from "../enum/vacancie-status.enum";

export class VacancieFiltersDto extends PaginationDto {

    @IsOptional()
    @IsEnum(VacancieStatus, { message: MSG.notValidValue('estado') })
    status?: VacancieStatus;

    @IsOptional()
    @Type(() => Number)
    companyId?: number;

    @IsOptional()
    @Type(() => Number)
    notAppliedByStudentId?: number;
}