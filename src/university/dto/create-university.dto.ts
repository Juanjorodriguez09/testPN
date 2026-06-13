import { IsNotEmpty, IsOptional, IsString, MaxLength } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";

export class CreateUniversityDto {

    @IsString({ message: MSG.string('El nombre') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El nombre') })
    name!: string;

    @IsString({ message: MSG.string('El NIT') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El NIT') })
    nit!: string;

    @IsString({ message: MSG.string('La dirección') })
    @IsOptional()
    address?: string;

    @IsString({ message: MSG.string('El teléfono') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El teléfono') })
    @MaxLength(15, { message: MSG.maxLength('El teléfono', 15) })
    phone!: string;

}
