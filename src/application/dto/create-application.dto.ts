import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";
import { ApplicationStatus } from "../enum/application-status.enum";
import { MSG } from "../../common/helpers/validation-messages.helper";


export class CreateApplicationDto {

    @ApiProperty({ example: 'Activa' })
    @IsEnum(ApplicationStatus, { message: MSG.notValidValue('estado') })
    status!: ApplicationStatus;

    @ApiProperty({ example: 'Pronto estaremos en contacto contigo para avanzar con el proceso de selección' })
    @IsString({ message: MSG.string('Los comentarios') })
    @IsNotEmpty({ message: MSG.isNotEmpty('Los comentarios') })
    @IsOptional()
    companyComments?: string;

    @ApiProperty({ example: 1 })
    @IsPositive({ message: MSG.isPositive('El estudiante') })
    @IsNumber({}, { message: MSG.isNumber('El estudiante') })
    studentId!: number;
}
