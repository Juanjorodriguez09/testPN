import { IsEmail, IsString, MinLength, Matches, IsNotEmpty, IsOptional, MaxLength, IsEnum } from 'class-validator';
import { MSG } from '../../common/helpers/validation-messages.helper';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IndustryType } from '../../company/enum/industry-type.enum';

export class UpdateCompanyDto {

    @ApiProperty({ example: 'IBMManagement18' })
    @IsString({ message: MSG.string('La contraseña') })
    @MinLength(8, { message: MSG.minLength('La contraseña', 8) })
    @IsOptional()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
        message: MSG.password()
    })
    password?: string;

    @ApiProperty({ example: 'Te acompañamos y ponemos a disposición el talento, habilidades, experiencia e ingeniería para alcanzar tus estrategias de transformación digital, nuevos productos o emprendimientos.' })
    @IsString({ message: MSG.string('La descripción') })
    @MaxLength(400, { message: MSG.maxLength('La descripción', 400) })
    @IsOptional()
    @IsNotEmpty({ message: MSG.isNotEmpty('La descripción') })
    description?: string;

    @ApiProperty({ example: 'Servicios y Consultoría TI' })
    @IsOptional()
    @IsEnum(IndustryType, { message: MSG.notValidValue('industria') })
    industry?: IndustryType;

    @ApiPropertyOptional({ example: 'Calle 101 # 14-23 - Boston Massachusetts' })
    @IsString({ message: MSG.string('La dirección') })
    @IsOptional()
    address?: string;

    @ApiProperty({ example: '3176356499' })
    @IsString({ message: MSG.string('El teléfono') })
    @MaxLength(15, { message: MSG.maxLength('El teléfono', 15) })
    @IsNotEmpty({ message: MSG.isNotEmpty('El teléfono') })
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ example: '8t3hg43283948324ufh2332.jpg' })
    @IsString({ message: MSG.string('El logo de la empresa') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El logo de la empresa') })
    @IsOptional()
    profilePhoto?: string;

}