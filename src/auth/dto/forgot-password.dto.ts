import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { MSG } from '../../common/helpers/validation-messages.helper';

export class ForgotPasswordDto {

    @ApiProperty({ example: 'carlosrojas@gmail.com' })
    @IsEmail({}, { message: MSG.email() })
    @IsNotEmpty({ message: MSG.isNotEmpty('El correo electrónico') })
    email!: string;
}