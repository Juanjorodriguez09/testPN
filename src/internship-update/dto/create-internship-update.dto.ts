import { IsString, IsNotEmpty, IsPositive, IsNumber } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { ApiProperty } from "@nestjs/swagger";


export class CreateInternshipUpdateDto {

    @ApiProperty({ example: 'Firma de contrato de aprendizaje e inscripción a ARL' })
    @IsString({ message: MSG.string('El título') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El título') })
    title!: string;

    @ApiProperty({ example: 'El día de hoy se diligenció el contrato de aprendizaje con el estudiante y se hizo su respectiva inscripción en la ARL' })
    @IsString({ message: MSG.string('La descripción') })
    @IsNotEmpty({ message: MSG.isNotEmpty('La descripción') })
    description!: string;

    @ApiProperty({ example: 1 })
    @IsPositive({ message: MSG.isPositive('La pasantía') })
    @IsNumber({}, { message: MSG.isNumber('La pasantía') })
    internshipId!: number;
}