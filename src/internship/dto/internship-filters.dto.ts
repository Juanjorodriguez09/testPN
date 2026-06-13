import { Type } from "class-transformer";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsDate, IsEnum, IsOptional } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { InternshipStatus } from "../enum/internship-status.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class InternshipFiltersDto extends PaginationDto {

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    applicationId?: number;

    @ApiPropertyOptional({ example: 2 })
    @IsOptional()
    @Type(() => Number)
    studentId?: number;

    @ApiPropertyOptional({ example: 3 })
    @IsOptional()
    @Type(() => Number)
    universityId?: number;

    @ApiPropertyOptional({ example: 4 })
    @IsOptional()
    @Type(() => Number)
    companyId?: number;

    @ApiPropertyOptional({ example: 'Activa' })
    @IsOptional()
    @IsEnum(InternshipStatus, { message: MSG.notValidValue('estado') })
    status?: InternshipStatus;

    @ApiPropertyOptional({ example: '2026-01-30' })
    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: MSG.isDate('La fecha de inicio') })
    startDate!: Date;

    @ApiPropertyOptional({ example: '2026-04-17' })
    @IsOptional()
    @Type(() => Date)
    @IsDate({ message: MSG.isDate('La fecha de finalización') })
    endDate!: Date;
}