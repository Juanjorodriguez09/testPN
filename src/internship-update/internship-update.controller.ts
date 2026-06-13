import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InternshipUpdateService } from './internship-update.service';
import { CreateInternshipUpdateDto } from './dto/create-internship-update.dto';
import { UpdateInternshipUpdateDto } from './dto/update-internship-update.dto';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums/role.enum';
import { InternshipUpdateFiltersDto } from './dto/internship-update-filters.dto';

@Controller('internship-update')
export class InternshipUpdateController {

  constructor(
    private readonly internshipUpdateService: InternshipUpdateService
  ) {}

  @Post()
  @Roles(Role.COMPANY, Role.SUPER_ADMIN)
  create(@Body() createInternshipUpdateDto: CreateInternshipUpdateDto) {
    return this.internshipUpdateService.create(createInternshipUpdateDto);
  }

  @Get()
  findAll( @Query() filters: InternshipUpdateFiltersDto ) {
    return this.internshipUpdateService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.internshipUpdateService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.COMPANY, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateInternshipUpdateDto: UpdateInternshipUpdateDto) {
    return this.internshipUpdateService.update(+id, updateInternshipUpdateDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.internshipUpdateService.remove(+id);
  }
}
