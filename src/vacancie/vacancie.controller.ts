import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VacancieService } from './vacancie.service';
import { CreateVacancieDto } from './dto/create-vacancie.dto';
import { UpdateVacancieDto } from './dto/update-vacancie.dto';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums/role.enum';
import { PaginationDto } from '../common/dto/pagination.dto';
import { VacancieFiltersDto } from './dto/vacancie-filters.dto';

@Controller('vacancie')
export class VacancieController {

  constructor(
    private readonly vacancieService: VacancieService
  ) {}

  @Post()
  @Roles(Role.COMPANY, Role.SUPER_ADMIN)
  create(@Body() createVacancieDto: CreateVacancieDto) {
    return this.vacancieService.create(createVacancieDto);
  }

  @Get()
  findAll( @Query() filters: VacancieFiltersDto ) {
    return this.vacancieService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vacancieService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.COMPANY, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updateVacancieDto: UpdateVacancieDto) {
    return this.vacancieService.update(+id, updateVacancieDto);
  }

  @Delete(':id')
  @Roles(Role.COMPANY, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.vacancieService.remove(+id);
  }
}
