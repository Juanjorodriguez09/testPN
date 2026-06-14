import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { MSG } from '../../common/helpers/validation-messages.helper';

export class ResetPasswordDto {

    @ApiProperty({ example: '34634g34g' })
    @IsString({ message: MSG.string('El token') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El token') })
    token!: string;

    @ApiProperty({ example: 'YourNewPassword' })
    @IsString({ message: MSG.string('La contraseña') })
    @MinLength(8, { message: MSG.minLength('La contraseña', 8) })
    @Matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
        message: MSG.password()
    })
    password!: string;
}