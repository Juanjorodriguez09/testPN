import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums/role.enum';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('university')
export class UniversityController {

  constructor(
    private readonly universityService: UniversityService
  ) {}

  @Get()
  findAll( @Query() pagination: PaginationDto ) {
    return this.universityService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.universityService.findOne(+id);
  }

  // @Patch(':id')
  // @Roles(Role.SUPER_ADMIN)
  // update(@Param('id') id: string, @Body() updateUniversityDto: UpdateUniversityDto) {
  //   return this.universityService.update(+id, updateUniversityDto);
  // }

  // @Delete(':id')
  // @Roles(Role.SUPER_ADMIN)
  // remove(@Param('id') id: string) {
  //   return this.universityService.remove(+id);
  // }
}
