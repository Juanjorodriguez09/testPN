import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../common/decorators';
import { ApplicationFiltersDto } from './dto/application-filters.dto';

@Controller('application')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':vacancieId')
  @Roles(Role.STUDENT, Role.SUPER_ADMIN)
  create(@Param('vacancieId', ParseIntPipe) vacancieId: number, @Body() createApplicationDto: CreateApplicationDto) {
    return this.applicationService.create(vacancieId, createApplicationDto);
  }

  @Get()
  findAll( @Query() filters: ApplicationFiltersDto ) {
    return this.applicationService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.STUDENT, Role.SUPER_ADMIN, Role.COMPANY)
  update(@Param('id') id: string, @Body() updateApplicationDto: UpdateApplicationDto) {
    return this.applicationService.update(+id, updateApplicationDto);
  }

  @Delete(':id')
  @Roles(Role.STUDENT, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.applicationService.remove(+id);
  }
}
