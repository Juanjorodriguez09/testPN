import { PartialType } from '@nestjs/swagger';
import { CreateInternshipUpdateDto } from './create-internship-update.dto';

export class UpdateInternshipUpdateDto extends PartialType(CreateInternshipUpdateDto) {}
