import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Public } from '../common/decorators';
import { AuthService } from './auth.service';
import { LoginDto, RegisterUniversityDto, RegisterCompanyDto, RegisterStudentDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register-university')
  registerUniversity(@Body() registerUniversityDto: RegisterUniversityDto) {
    return this.authService.registerUniversity(registerUniversityDto);
  }

  @Public()
  @Post('register-company')
  registerCompany(@Body() registerCompanyDto: RegisterCompanyDto) {
    return this.authService.registerCompany(registerCompanyDto);
  }

  @Public()
  @Post('register-student')
  registerStudent(@Body() registerStudentDto: RegisterStudentDto) {
    return this.authService.registerStudent(registerStudentDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.email, loginDto.password);
  }

}