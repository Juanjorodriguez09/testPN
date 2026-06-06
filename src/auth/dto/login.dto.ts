import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { MSG } from '../../common/helpers/validation-messages.helper';

export class LoginDto {
  @IsEmail({}, { message: MSG.email() })
  email!: string;

  @IsString({ message: MSG.string('La contraseña') })
  @IsNotEmpty({ message: MSG.required('La contraseña') })
  password!: string;
}