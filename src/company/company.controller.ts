import { Controller, Get, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { Role } from '../common/enums/role.enum';
import { Roles } from '../common/decorators';
import { CompanyFiltersDto } from './dto/company-filters.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get()
  findAll( @Query() filters: CompanyFiltersDto ) {
    return this.companyService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.companyService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.COMPANY)
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(+id, updateCompanyDto);
  }

  // @Delete(':id')
  // @Roles(Role.SUPER_ADMIN)
  // remove(@Param('id') id: string) {
  //   return this.companyService.remove(+id);
  // }
}
