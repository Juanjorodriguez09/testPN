import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums/role.enum';

@Controller('seed')
export class SeedController {

  constructor(
    private readonly seedService: SeedService
  ) {}

  @Get()
  @Roles(Role.SUPER_ADMIN)
  executeSeed() {
    return this.seedService.runSeed();
  }

}
