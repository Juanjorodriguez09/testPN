import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { StudentService } from './student.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { PaginationDto } from '../common/dto/pagination.dto';

@Controller('student')
export class StudentController {

  constructor(
    private readonly studentService: StudentService
  ) {}

  @Get()
  findAll( @Query() pagination: PaginationDto ) {
    return this.studentService.findAll(pagination);
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
