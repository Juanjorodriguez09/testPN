import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { JwtPayload } from '../../auth/interfaces/jwt-payload.interface';
import { MSG } from '../helpers/validation-messages.helper';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if ( !user )
        throw new InternalServerErrorException(MSG.notFound('usuario'));
    
    return user;
  },
);