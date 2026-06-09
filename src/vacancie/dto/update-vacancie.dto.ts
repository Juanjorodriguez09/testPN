import { PartialType } from '@nestjs/swagger';
import { CreateVacancieDto } from './create-vacancie.dto';

export class UpdateVacancieDto extends PartialType(CreateVacancieDto) {}
