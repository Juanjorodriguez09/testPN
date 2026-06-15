import { Controller, Get, Param, Delete, Query } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillFiltersDto } from './dto/skill-filters.dto';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums/role.enum';

@Controller('skill')
export class SkillController {

  constructor(
    private readonly skillService: SkillService
  ) {}

  @Get()
  findAll( @Query() filters: SkillFiltersDto ) {
    return this.skillService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillService.findOne(+id);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.skillService.remove(+id);
  }
}
