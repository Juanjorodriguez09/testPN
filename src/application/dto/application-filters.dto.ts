import { Type } from "class-transformer";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsEnum, IsOptional } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { ApplicationStatus } from "../enum/application-status.enum";

export class ApplicationFiltersDto extends PaginationDto {

    @IsOptional()
    @Type(() => Number)
    studentId?: number;

    @IsOptional()
    @IsEnum(ApplicationStatus, { message: MSG.notValidValue('estado') })
    status?: ApplicationStatus;

    @IsOptional()
    @Type(() => Number)
    companyId?: number;
}