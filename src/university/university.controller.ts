import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { Public, Roles } from '../common/decorators';
import { Role } from '../common/enums/role.enum';
import { UniversityFiltersDto } from './dto/university-filters.dto';

@Controller('university')
export class UniversityController {

  constructor(
    private readonly universityService: UniversityService
  ) {}

  @Get()
  @Public()
  findAll( @Query() filters: UniversityFiltersDto ) {
    return this.universityService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.universityService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.UNIVERSITY)
  update(@Param('id') id: string, @Body() updateUniversityDto: UpdateUniversityDto) {
    return this.universityService.update(+id, updateUniversityDto);
  }

  // @Delete(':id')
  // @Roles(Role.SUPER_ADMIN)
  // remove(@Param('id') id: string) {
  //   return this.universityService.remove(+id);
  // }
}
