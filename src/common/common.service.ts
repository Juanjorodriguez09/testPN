import { Injectable, NotFoundException } from '@nestjs/common';
import { CONSTANTS_REGISTRY } from './constants.registry';

@Injectable()
export class CommonService {
    
  getValues(constantName: string): string[] {
    const enumObject = CONSTANTS_REGISTRY[constantName];

    if (!enumObject) {
      throw new NotFoundException(
        `Constant '${constantName}' not found.`,
      );
    }

    return Object.values(enumObject);
  }
}