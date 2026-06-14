import { Type } from "class-transformer";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsEnum, IsOptional } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { ApplicationStatus } from "../enum/application-status.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class ApplicationFiltersDto extends PaginationDto {

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    studentId?: number;

    @ApiPropertyOptional({ example: 'Activa' })
    @IsOptional()
    @IsEnum(ApplicationStatus, { message: MSG.notValidValue('estado') })
    status?: ApplicationStatus;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    companyId?: number;

    @ApiPropertyOptional({ example: true })
    @IsOptional()
    @Type(() => Boolean)
    withoutInternship?: boolean;
}