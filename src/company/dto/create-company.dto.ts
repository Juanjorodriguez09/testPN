import { IsString, IsNotEmpty, IsOptional, MaxLength, IsEnum } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { IndustryType } from "../enum/industry-type.enum";


export class CreateCompanyDto {

    @IsString({ message: MSG.string('El nombre') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El nombre') })
    name!: string;

    @IsString({ message: MSG.string('La descripción') })
    @IsNotEmpty({ message: MSG.isNotEmpty('La descripción') })
    description!: string;

    @IsString({ message: MSG.string('El NIT') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El NIT') })
    nit!: string;

    @IsEnum(IndustryType, { message: MSG.notValidValue('industria') })
    industry!: IndustryType;

    @IsString({ message: MSG.string('La dirección') })
    @IsOptional()
    address?: string;

    @IsString({ message: MSG.string('El teléfono') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El teléfono') })
    @MaxLength(15, { message: MSG.maxLength('El teléfono', 15) })
    phone!: string;
}
