import { IsString, IsNotEmpty, IsEnum, MaxLength, IsPositive, IsNumber } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { Career } from "../enum/career.enum";

export class CreateStudentDto {

    @IsString({ message: MSG.string('El nombre completo') })
    @IsNotEmpty({ message: MSG.required('El nombre completo') })
    fullName!: string;

    @IsString({ message: MSG.string('Sobre mí') })
    @IsNotEmpty({ message: MSG.required('Sobre mí') })
    about!: string;

    @IsString({ message: MSG.string('El número de documento') })
    @IsNotEmpty({ message: MSG.required('El número de documento') })
    documentNumber!: string;
    
    @IsString({ message: MSG.string('El teléfono') })
    @IsNotEmpty({ message: MSG.required('El teléfono') })
    @MaxLength(15, { message: MSG.maxLength('El teléfono', 15) })
    phone!: string;
    
    @IsEnum(Career, { message: MSG.notValidValue('carrera') })
    career!: Career;

    @IsPositive({ message: MSG.isPositive('El semestre') })
    @IsNumber({}, { message: MSG.isNumber('El semestre') })
    semester!: number;

    @IsPositive({ message: MSG.isPositive('La universidad') })
    @IsNumber({}, { message: MSG.isNumber('La universidad') })
    universityId!: number;
}
