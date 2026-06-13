import { IsDate, IsEnum, IsNumber, IsPositive } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { ApiProperty } from "@nestjs/swagger";
import { InternshipStatus } from "../enum/internship-status.enum";
import { Type } from "class-transformer";

export class CreateInternshipDto {

    @ApiProperty({ example: 'Activa' })
    @IsEnum(InternshipStatus, { message: MSG.notValidValue('estado') })
    status!: InternshipStatus;

    @ApiProperty({ example: '2026-01-26' })
    @Type(() => Date)
    @IsDate({ message: MSG.isDate('La fecha de inicio') })
    startDate!: Date;

    @ApiProperty({ example: '2026-04-17' })
    @Type(() => Date)
    @IsDate({ message: MSG.isDate('La fecha de finalización') })
    endDate!: Date;

    @ApiProperty({ example: 1 })
    @IsPositive({ message: MSG.isPositive('La postulación') })
    @IsNumber({}, { message: MSG.isNumber('La postulación') })
    applicationId!: number;
}
