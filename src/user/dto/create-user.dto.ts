import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { MSG } from '../../common/helpers/validation-messages.helper';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {

    @ApiProperty({ example: 'juliana@google.com' })
    @IsEmail({}, { message: MSG.email() })
    email!: string;

    @ApiProperty({ example: 'Juliana939' })
    @IsString({ message: MSG.string('La contraseña') })
    @MinLength(6, { message: MSG.minLength('La contraseña', 6) })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: MSG.password()
    })
    password!: string;

    @ApiProperty({ example: 'super-admin' })
    @IsEnum(Role, { message: MSG.notValidValue('rol') })
    role!: Role;

    @ApiProperty({ example: true })
    @IsBoolean({ message: MSG.notValidValue('isActive') })
    isActive!: boolean;
}