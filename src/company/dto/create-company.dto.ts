import { IsString, IsNotEmpty, IsOptional, MaxLength, IsEnum } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { IndustryType } from "../enum/industry.enum";


export class CreateCompanyDto {

    @IsString({ message: MSG.string('El nombre') })
    @IsNotEmpty({ message: MSG.required('El nombre') })
    name!: string;

    @IsString({ message: MSG.string('La descripción') })
    @IsNotEmpty({ message: MSG.required('La descripción') })
    description!: string;

    @IsString({ message: MSG.string('El NIT') })
    @IsNotEmpty({ message: MSG.required('El NIT') })
    nit!: string;

    @IsEnum(IndustryType, { message: MSG.notValidValue('industria') })
    industry!: IndustryType;

    @IsString({ message: MSG.string('La dirección') })
    @IsOptional()
    address?: string;

    @IsString({ message: MSG.string('El teléfono') })
    @IsNotEmpty({ message: MSG.required('El teléfono') })
    @MaxLength(15, { message: MSG.maxLength('El teléfono', 15) })
    phone!: string;
}
