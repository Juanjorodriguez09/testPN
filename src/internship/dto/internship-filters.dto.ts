import { Type } from "class-transformer";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsDate, IsEnum, IsOptional } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { InternshipStatus } from "../enum/internship-status.enum";

export class InternshipFiltersDto extends PaginationDto {

    @IsOptional()
    @Type(() => Number)
    applicationId?: number;

    @IsOptional()
    @Type(() => Number)
    studentId?: number;

    @IsOptional()
    @Type(() => Number)
    universityId?: number;

    @IsOptional()
    @Type(() => Number)
    companyId?: number;

    @IsOptional()
    @IsEnum(InternshipStatus, { message: MSG.notValidValue('estado') })
    status?: InternshipStatus;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: MSG.isDate('La fecha de inicio') })
    startDate!: Date;

    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: MSG.isDate('La fecha de finalización') })
    endDate!: Date;
}