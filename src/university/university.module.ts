import { Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityController } from './university.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { University } from './entities/university.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ University ])
  ],
  exports: [
    UniversityService,
    TypeOrmModule
  ],
  controllers: [UniversityController],
  providers: [UniversityService],
})
export class UniversityModule {}
