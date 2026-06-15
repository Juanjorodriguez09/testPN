import { Type } from "class-transformer";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { VacancieStatus } from "../enum/vacancie-status.enum";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Modality } from "../enum/modality.enum";
import { IndustryType } from "../../company/enum/industry-type.enum";

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

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    studentId?: number;

    @ApiProperty({ example: 'Ingeniero DevOps' })
    @IsString({ message: MSG.string('El título') })
    @IsOptional()
    title?: string;

    @ApiProperty({ example: 1500000 })
    @IsPositive({ message: MSG.isPositive('El salario') })
    @IsNumber({}, { message: MSG.isNumber('El salario') })
    @Type(() => Number)
    @IsOptional()
    salary?: number;

    @ApiProperty({ example: 'Colombia' })
    @IsString({ message: MSG.string('La ubicación') })
    @IsOptional()
    location?: string;

    @ApiProperty({ example: 'Remoto' })
    @IsEnum(Modality, { message: MSG.notValidValue('modalidad') })
    @IsOptional()
    modality?: Modality;

    @ApiProperty({ example: IndustryType.ITServicesAndConsulting })
    @IsEnum(IndustryType, { message: MSG.notValidValue('industria') })
    @IsOptional()
    industry?: IndustryType;
}