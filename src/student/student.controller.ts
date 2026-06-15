import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentFiltersDto } from './dto/student-filters.dto';
import { Roles } from '../common/decorators';
import { Role } from '../common/enums/role.enum';
import { AssignSkillDto } from '../skill/dto/assign-skill.dto';

@Controller('student')
export class StudentController {

  constructor(
    private readonly studentService: StudentService
  ) {}

  @Get()
  findAll( @Query() filters: StudentFiltersDto ) {
    return this.studentService.findAll(filters);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.studentService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.STUDENT)
  update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentService.update(+id, updateStudentDto);
  }

  // @Delete(':id')
  // @Roles(Role.SUPER_ADMIN)
  // remove(@Param('id') id: string) {
  //   return this.studentService.remove(+id);
  // }

  @Post(':id/skills')
  @Roles(Role.SUPER_ADMIN, Role.STUDENT)
  assignSkills( @Param('id') id: string, @Body() assignSkillDto: AssignSkillDto, ) {
    return this.studentService.assignSkills(+id, assignSkillDto);
  }

  @Delete(':id/skills/:skillId')
  @Roles(Role.SUPER_ADMIN, Role.STUDENT)
  removeSkill(@Param('id') id: string, @Param('skillId') skillId: string) {
    return this.studentService.removeSkill(+id, +skillId);
  }
}
