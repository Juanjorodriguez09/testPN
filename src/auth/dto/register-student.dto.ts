import { IsEmail, IsString, MinLength, Matches, IsNotEmpty, IsOptional, MaxLength, IsEnum, IsNumber, IsPositive } from 'class-validator';
import { MSG } from '../../common/helpers/validation-messages.helper';
import { ApiProperty } from '@nestjs/swagger';
import { Career } from '../../student/enum/career.enum';

export class RegisterStudentDto {
    
    @ApiProperty({ example: 'projas45@cue.edu.co' })
    @IsEmail({}, { message: MSG.email() })
    email!: string;

    @ApiProperty({ example: 'PipeRojas14' })
    @IsString({ message: MSG.string('La contraseña') })
    @MinLength(8, { message: MSG.minLength('La contraseña', 8) })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
        message: MSG.password()
    })
    password!: string;

    @ApiProperty({ example: 'Felipe Rojas García' })
    @IsString({ message: MSG.string('El nombre completo') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El nombre completo') })
    fullName!: string;

    @ApiProperty({ example: 'Soy un estudiante apasionado por el desarrollo de aplicaciones web' })
    @IsString({ message: MSG.string('Sobre mí') })
    @MaxLength(400, { message: MSG.maxLength('Sobre mí', 400) })
    @IsNotEmpty({ message: MSG.isNotEmpty('Sobre mí') })
    about!: string;

    @ApiProperty({ example: '324.43634.23' })
    @IsString({ message: MSG.string('El número de documento') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El número de documento') })
    documentNumber!: string;

    @ApiProperty({ example: '3176356499' })
    @IsString({ message: MSG.string('El teléfono') })
    @MaxLength(15, { message: MSG.maxLength('El teléfono', 15) })
    @IsNotEmpty({ message: MSG.isNotEmpty('El teléfono') })
    phone!: string;

    @ApiProperty({ example: Career.SoftwareEngineering })
    @IsEnum(Career, { message: MSG.notValidValue('carrera') })
    career!: Career;

    @ApiProperty({ example: 6 })
    @IsPositive({ message: MSG.isPositive('El semestre') })
    @IsNumber({}, { message: MSG.isNumber('El semestre') })
    semester!: number;

    @ApiProperty({ example: 1 })
    @IsPositive({ message: MSG.isPositive('La universidad') })
    @IsNumber({}, { message: MSG.isNumber('La universidad') })
    universityId!: number;

}