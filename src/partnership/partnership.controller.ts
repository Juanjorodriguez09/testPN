import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PartnershipService } from './partnership.service';
import { CreatePartnershipDto } from './dto/create-partnership.dto';
import { UpdatePartnershipDto } from './dto/update-partnership.dto';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums/role.enum';
import { PartnershipFiltersDto } from './dto/partnership-filters.dto';

@Controller('partnership')
export class PartnershipController {

  constructor(
    private readonly partnershipService: PartnershipService
  ) {}

  @Post()
  @Roles(Role.UNIVERSITY, Role.COMPANY, Role.SUPER_ADMIN)
  create(@Body() createPartnershipDto: CreatePartnershipDto) {
    return this.partnershipService.create(createPartnershipDto);
  }

  @Get()
  @Roles(Role.UNIVERSITY, Role.COMPANY, Role.SUPER_ADMIN)
  findAll( @Query() filters: PartnershipFiltersDto ) {
    return this.partnershipService.findAll(filters);
  }

  @Get(':id')
  @Roles(Role.UNIVERSITY, Role.COMPANY, Role.SUPER_ADMIN)
  findOne(@Param('id') id: string) {
    return this.partnershipService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.UNIVERSITY, Role.COMPANY, Role.SUPER_ADMIN)
  update(@Param('id') id: string, @Body() updatePartnershipDto: UpdatePartnershipDto) {
    return this.partnershipService.update(+id, updatePartnershipDto);
  }

  @Delete(':id')
  @Roles(Role.UNIVERSITY, Role.COMPANY, Role.SUPER_ADMIN)
  remove(@Param('id') id: string) {
    return this.partnershipService.remove(+id);
  }
}
