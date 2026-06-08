import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { MSG } from '../../common/helpers/validation-messages.helper';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {

  @ApiProperty({ example: 'juliana@google.com' })
  @IsEmail({}, { message: MSG.email() })
  email!: string;

  @ApiProperty({ example: 'Juliana939' })
  @IsString({ message: MSG.string('La contraseña') })
  @IsNotEmpty({ message: MSG.required('La contraseña') })
  password!: string;
}