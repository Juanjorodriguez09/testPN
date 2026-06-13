import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InternshipService } from './internship.service';
import { CreateInternshipDto } from './dto/create-internship.dto';
import { UpdateInternshipDto } from './dto/update-internship.dto';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums/role.enum';
import { InternshipFiltersDto } from './dto/internship-filters.dto';

@Controller('internship')
export class InternshipController {

  constructor(
    private readonly internshipService: InternshipService
  ) {}

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.COMPANY)
  create(@Body() createInternshipDto: CreateInternshipDto) {
    return this.internshipService.create(createInternshipDto);
  }

  @Get()
  findAll( @Query() filters: InternshipFiltersDto ) {
    return this.internshipService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.internshipService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.COMPANY)
  update(@Param('id') id: string, @Body() updateInternshipDto: UpdateInternshipDto) {
    return this.internshipService.update(+id, updateInternshipDto);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.COMPANY)
  remove(@Param('id') id: string) {
    return this.internshipService.remove(+id);
  }
}
