import { Type } from "class-transformer";
import { PaginationDto } from "../../common/dto/pagination.dto";
import { IsEnum, IsOptional } from "class-validator";
import { MSG } from "../../common/helpers/validation-messages.helper";
import { PartnershipStatus } from "../enum/partnership-status.enum";

export class PartnershipFiltersDto extends PaginationDto {

    @IsOptional()
    @IsEnum(PartnershipStatus, { message: MSG.notValidValue('estado') })
    status?: PartnershipStatus;

    @IsOptional()
    @Type(() => Number)
    companyId?: number;

    @IsOptional()
    @Type(() => Number)
    universityId?: number;

}