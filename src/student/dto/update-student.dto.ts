import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, Matches, IsNotEmpty, MaxLength, IsEnum, IsPositive, IsNumber, IsOptional } from 'class-validator';
import { MSG } from '../../common/helpers/validation-messages.helper';
import { Career } from '../enum/career.enum';

export class UpdateStudentDto {

    @ApiProperty({ example: 'PipeRojas14' })
    @IsString({ message: MSG.string('La contraseña') })
    @MinLength(8, { message: MSG.minLength('La contraseña', 8) })
    @IsOptional()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
        message: MSG.password()
    })
    password?: string;

    @ApiProperty({ example: 'Soy un estudiante apasionado por el desarrollo de aplicaciones web' })
    @IsString({ message: MSG.string('Sobre mí') })
    @MaxLength(400, { message: MSG.maxLength('Sobre mí', 400) })
    @IsOptional()
    @IsNotEmpty({ message: MSG.required('Sobre mí') })
    about?: string;

    @ApiProperty({ example: '3176356499' })
    @IsString({ message: MSG.string('El teléfono') })
    @MaxLength(15, { message: MSG.maxLength('El teléfono', 15) })
    @IsOptional()
    @IsNotEmpty({ message: MSG.required('El teléfono') })
    phone?: string;

    @ApiProperty({ example: Career.SoftwareEngineering })
    @IsOptional()
    @IsEnum(Career, { message: MSG.notValidValue('carrera') })
    career?: Career;

    @ApiProperty({ example: 6 })
    @IsPositive({ message: MSG.isPositive('El semestre') })
    @IsOptional()
    @IsNumber({}, { message: MSG.isNumber('El semestre') })
    semester?: number;

}