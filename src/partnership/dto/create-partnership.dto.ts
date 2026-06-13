import { IsPositive, IsNumber, IsEnum, IsNotEmpty, IsString, IsOptional } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { ApiProperty } from "@nestjs/swagger";
import { PartnershipStatus } from "../enum/partnership-status.enum";


export class CreatePartnershipDto {

    @ApiProperty({ example: 'Me interesa ofrecer vacantes en su universidad' })
    @IsString({ message: MSG.string('El comentario') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El comentario') })
    @IsOptional()
    comment!: string;

    @ApiProperty({ example: 'Activo' })
    @IsEnum(PartnershipStatus, { message: MSG.notValidValue('estado') })
    status!: PartnershipStatus;

    @ApiProperty({ example: 1 })
    @IsPositive({ message: MSG.isPositive('La empresa') })
    @IsNumber({}, { message: MSG.isNumber('La empresa') })
    companyId!: number;

    @ApiProperty({ example: 1 })
    @IsPositive({ message: MSG.isPositive('La universidad') })
    @IsNumber({}, { message: MSG.isNumber('La universidad') })
    universityId!: number;
}
