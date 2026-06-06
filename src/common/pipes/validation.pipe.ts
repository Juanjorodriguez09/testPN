import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationError,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
    async transform(value: any, { metatype }: ArgumentMetadata) {
        if (!metatype || !this.needsValidation(metatype)) return value;

        const object = plainToInstance(metatype, value);
        const errors = await validate(object);

        if (errors.length > 0) {
            throw new BadRequestException({
            statusCode  : 400,
            error       : 'Bad Request',
            formErrors  : this.formatErrors(errors),
            });
        }

        return value;
    }

    private formatErrors(errors: ValidationError[]): Record<string, string> {
        return errors.reduce((acc, error) => {
            // Toma solo el primer mensaje de error del campo
            const [firstMessage] = Object.values(error.constraints ?? {});
            acc[error.property] = firstMessage;
            
            return acc;
        }, {} as Record<string, string>);
    }

    private needsValidation(metatype: any): boolean {
        const primitives = [String, Boolean, Number, Array, Object];
        return !primitives.includes(metatype);
    }
}