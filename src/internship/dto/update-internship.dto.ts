import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateInternshipDto } from './create-internship.dto';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { MSG } from '../../common/helpers/validation-messages.helper';

export class UpdateInternshipDto extends PartialType(CreateInternshipDto) {

    @ApiPropertyOptional({ example: '8t3hg43283948324ufh2332.jpg' })
    @IsString({ message: MSG.string('El certificado de afiliación a la ARL') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El certificado de afiliación a la ARL') })
    @IsOptional()
    arlCertification?: string;

    @ApiPropertyOptional({ example: '8t3hg43283948324ufh2332.jpg' })
    @IsString({ message: MSG.string('El certificado de afiliación a la EPS') })
    @IsNotEmpty({ message: MSG.isNotEmpty('El certificado de afiliación a la EPS') })
    @IsOptional()
    epsCertification?: string;

}
