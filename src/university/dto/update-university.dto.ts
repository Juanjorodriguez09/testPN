import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { MSG } from '../../common/helpers/validation-messages.helper';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUniversityDto {

    @ApiPropertyOptional({ example: 'Calle 101 # 14-23 - Boston Massachusetts' })
    @IsString({ message: MSG.string('La dirección') })
    @IsOptional()
    address?: string;

    @ApiPropertyOptional({ example: '314543234' })
    @IsString({ message: MSG.string('El teléfono') })
    @IsNotEmpty({ message: MSG.required('El teléfono') })
    @MaxLength(15, { message: MSG.maxLength('El teléfono', 15) })
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional({ example: 'HarvardManagement18' })
    @IsString({ message: MSG.string('La contraseña') })
    @MinLength(8, { message: MSG.minLength('La contraseña', 8) })
    @IsOptional()
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
        message: MSG.password()
    })
    password?: string;
}
