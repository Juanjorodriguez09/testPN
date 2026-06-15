import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { SkillModule } from '../skill/skill.module';

@Module({
  imports: [
    SkillModule
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}
