import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsPositive } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";


export class AssignSkillDto {

    @ApiProperty({ example: 1 })
    @IsPositive({ message: MSG.isPositive('La habilidad') })
    @IsNumber({}, { message: MSG.isNumber('La habilidad') })
    skillId!: number;

}