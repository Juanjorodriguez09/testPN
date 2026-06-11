import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentFiltersDto } from './dto/student-filters.dto';

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

  // @Patch(':id')
  // @Roles(Role.SUPER_ADMIN)
  // update(@Param('id') id: string, @Body() updateStudentDto: UpdateStudentDto) {
  //   return this.studentService.update(+id, updateStudentDto);
  // }

  // @Delete(':id')
  // @Roles(Role.SUPER_ADMIN)
  // remove(@Param('id') id: string) {
  //   return this.studentService.remove(+id);
  // }
}
