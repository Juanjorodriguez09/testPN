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

export class CreateUserDto {

    @IsEmail({}, { message: MSG.email() })
    email!: string;

    @IsString({ message: MSG.string('La contraseña') })
    @MinLength(6, { message: MSG.minLength('La contraseña', 6) })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: MSG.password
    })
    password!: string;

    @IsEnum(Role, { message: MSG.notValidValue('rol') })
    role!: Role;

    @IsBoolean({ message: MSG.notValidValue('isActive') })
    isActive!: boolean;
}