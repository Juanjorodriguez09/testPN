import { IsEmail, IsString, MinLength, Matches, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { Role } from '../../common/enums/role.enum';
import { MSG } from '../../common/helpers/validation-messages.helper';

export class RegisterUniversityDto {

    @IsEmail({}, { message: MSG.email() })
    email!: string;

    @IsString({ message: MSG.string('La contraseña') })
    @MinLength(6, { message: MSG.minLength('La contraseña', 6) })
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: MSG.password
    })
    password!: string;

    @IsString({ message: MSG.string('El nombre') })
    @IsNotEmpty({ message: MSG.required('El nombre') })
    name!: string;

    @IsString({ message: MSG.string('El NIT') })
    @IsNotEmpty({ message: MSG.required('El NIT') })
    nit!: string;

    @IsString({ message: MSG.string('La dirección') })
    @IsOptional()
    address?: string;

    @IsString({ message: MSG.string('El teléfono') })
    @IsNotEmpty({ message: MSG.required('El teléfono') })
    @MaxLength(15, { message: MSG.maxLength('El teléfono', 15) })
    phone!: string;

}