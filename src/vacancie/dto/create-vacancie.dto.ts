import { IsString, IsNotEmpty, IsOptional, IsNumber, IsPositive, IsEnum } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { Modality } from "../enum/modality.enum";
import { VacancieStatus } from "../enum/vacancie-status.enum";
import { ApiProperty } from "@nestjs/swagger";


export class CreateVacancieDto {

    @ApiProperty({ example: 'Ingeniero DevOps' })
    @IsString({ message: MSG.string('El título') })
    @IsNotEmpty({ message: MSG.required('El título') })
    title!: string;
    
    @ApiProperty({ example: 'Participar de la producción de software en un entorno DevOps asegurando buenas prácticas CI/CD' })
    @IsString({ message: MSG.string('La descripción') })
    @IsNotEmpty({ message: MSG.required('La descripción') })
    description!: string;
    
    @ApiProperty({ example: 'Experiencia en Linux, CI/CD, Docker, Kubernetes, nube (AWS/Azure/GCP), IaC (Terraform), Git, scripting, monitoreo, seguridad, redes, automatización y trabajo ágil.' })
    @IsString({ message: MSG.string('Los requisitos') })
    @IsOptional()
    requirements?: string;

    @ApiProperty({ example: 1500000 })
    @IsPositive({ message: MSG.isPositive('El salario') })
    @IsNumber({}, { message: MSG.isNumber('El salario') })
    salary!: number;
    
    @ApiProperty({ example: 'Colombia' })
    @IsString({ message: MSG.string('La ubicación') })
    @IsNotEmpty({ message: MSG.required('La ubicación') })
    location!: string;

    @ApiProperty({ example: 'Remoto' })
    @IsEnum(Modality, { message: MSG.notValidValue('modalidad') })
    modalitiy!: Modality;

    @ApiProperty({ example: 'Activa' })
    @IsEnum(VacancieStatus, { message: MSG.notValidValue('estado') })
    status!: VacancieStatus;

    @ApiProperty({ example: 1 })
    @IsPositive({ message: MSG.isPositive('La empresa') })
    @IsNumber({}, { message: MSG.isNumber('La empresa') })
    companyId!: number;

}
