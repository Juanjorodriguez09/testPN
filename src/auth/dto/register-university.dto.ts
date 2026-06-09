import { IsEmail, IsString, MinLength, Matches, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { MSG } from '../../common/helpers/validation-messages.helper';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterUniversityDto {
    
    @ApiProperty({ example: 'admin@harvard.com' })
    @IsEmail({}, { message: MSG.email() })
    email!: string;

    @ApiProperty({ example: 'HarvardManagement18' })
    @IsString({ message: MSG.string('La contraseña') })
    @MinLength(8, { message: MSG.minLength('La contraseña', 8) })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
        message: MSG.password
    })
    password!: string;

    @ApiProperty({ example: 'Harvard' })
    @IsString({ message: MSG.string('El nombre') })
    @IsNotEmpty({ message: MSG.required('El nombre') })
    name!: string;

    @ApiProperty({ example: '324.25545.23' })
    @IsString({ message: MSG.string('El NIT') })
    @IsNotEmpty({ message: MSG.required('El NIT') })
    nit!: string;

    @ApiPropertyOptional({ example: 'Calle 101 # 14-23 - Boston Massachusetts' })
    @IsString({ message: MSG.string('La dirección') })
    @IsOptional()
    address?: string;

    @ApiProperty({ example: '314543234' })
    @IsString({ message: MSG.string('El teléfono') })
    @MaxLength(15, { message: MSG.maxLength('El teléfono', 15) })
    @IsNotEmpty({ message: MSG.required('El teléfono') })
    phone!: string;

}