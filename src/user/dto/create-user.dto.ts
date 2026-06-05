import {
    IsBoolean,
    IsEmail,
    IsEnum,
    IsString,
    Matches,
    MinLength,
} from 'class-validator';
import { Role } from '../../common/enums/role.enum';

export class CreateUserDto {

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have an uppercase, a lowercase letter and a number'
    })
    password!: string;

    @IsEnum(Role)
    role!: Role;

    @IsBoolean()
    isActive!: boolean;
}