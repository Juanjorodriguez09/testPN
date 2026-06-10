import { Injectable, NotFoundException } from '@nestjs/common';
import { CONSTANTS_REGISTRY } from './constants.registry';
import { MSG } from './helpers/validation-messages.helper';

@Injectable()
export class CommonService {
    
  getValues(constantName: string): string[] {
    const enumObject = CONSTANTS_REGISTRY[constantName];

    if (!enumObject) {
      throw new NotFoundException(
        MSG.notFound(constantName),
      );
    }

    return Object.values(enumObject);
  }
}