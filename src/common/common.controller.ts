import { Controller, Get, Param } from '@nestjs/common';
import { CommonService } from './common.service';
import { Public } from './decorators';

@Controller('common')
export class CommonController {

    constructor(
        private readonly commonService: CommonService
    ) {}

    @Get(':constantName')
    @Public()
    getConstant(@Param('constantName') constantName: string): string[] {
        return this.commonService.getValues(constantName);
    }
}