import { IsEmail, IsString, MinLength, Matches, IsNotEmpty, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { MSG } from '../../common/helpers/validation-messages.helper';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IndustryType } from '../../company/enum/industry.enum';

export class RegisterCompanyDto {
    
    @ApiProperty({ example: 'admin@ibm.com' })
    @IsEmail({}, { message: MSG.email() })
    email!: string;

    @ApiProperty({ example: 'IBMManagement18' })
    @IsString({ message: MSG.string('La contraseña') })
    @MinLength(6, { message: MSG.minLength('La contraseña', 6) })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: MSG.password
    })
    password!: string;

    @ApiProperty({ example: 'IBM' })
    @IsString({ message: MSG.string('El nombre') })
    @IsNotEmpty({ message: MSG.required('El nombre') })
    name!: string;

    @ApiProperty({ example: 'Te acompañamos y ponemos a disposición el talento, habilidades, experiencia e ingeniería para alcanzar tus estrategias de transformación digital, nuevos productos o emprendimientos.' })
    @IsString({ message: MSG.string('La descripción') })
    @MaxLength(400, { message: MSG.maxLength('La descripción', 400) })
    @IsNotEmpty({ message: MSG.required('La descripción') })
    description!: string;

    @ApiProperty({ example: '324.43634.23' })
    @IsString({ message: MSG.string('El NIT') })
    @IsNotEmpty({ message: MSG.required('El NIT') })
    nit!: string;

    @ApiProperty({ example: 'Servicios y Consultoría TI' })
    @IsEnum(IndustryType, { message: MSG.notValidValue('industria') })
    industry!: IndustryType;

    @ApiPropertyOptional({ example: 'Calle 101 # 14-23 - Boston Massachusetts' })
    @IsString({ message: MSG.string('La dirección') })
    @IsOptional()
    address?: string;

    @ApiProperty({ example: '3176356499' })
    @IsString({ message: MSG.string('El teléfono') })
    @MaxLength(15, { message: MSG.maxLength('El teléfono', 15) })
    @IsNotEmpty({ message: MSG.required('El teléfono') })
    phone!: string;

}