import { Type } from "class-transformer";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsEnum, IsOptional } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { PartnershipStatus } from "../enum/partnership-status.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class PartnershipFiltersDto extends PaginationDto {

    @ApiPropertyOptional({ example: 'Activo' })
    @IsOptional()
    @IsEnum(PartnershipStatus, { message: MSG.notValidValue('estado') })
    status?: PartnershipStatus;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    companyId?: number;

    @ApiPropertyOptional({ example: 1 })
    @IsOptional()
    @Type(() => Number)
    universityId?: number;

}