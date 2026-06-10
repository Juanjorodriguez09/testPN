import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    // Si no es un error de validación (array de mensajes), lo devuelve tal cual
    if (!Array.isArray(exceptionResponse?.message)) {
      return response.status(status).json(exceptionResponse);
    }

    // Agrupa los errores por campo usando los ValidationError de class-validator
    const groupedErrors = this.groupErrors(exceptionResponse.message);

    return response.status(status).json({
      message: groupedErrors,
      error: 'Bad Request',
      statusCode: status,
    });
  }

  private groupErrors(errors: any[]): Record<string, string[]> {
    // Si vienen como objetos ValidationError (con children/constraints)
    if (errors[0] && typeof errors[0] === 'object' && errors[0].constraints) {
      return this.parseValidationErrors(errors);
    }

    // Fallback: si vienen como strings planos, los agrupa sin campo definido
    return { general: errors };
  }

  private parseValidationErrors(
    errors: any[],
    parentField = '',
  ): Record<string, string[]> {
    const result: Record<string, string[]> = {};

    for (const error of errors) {
      const fieldName = parentField
        ? `${parentField}.${error.property}`
        : error.property;

      if (error.constraints) {
        result[fieldName] = Object.values(error.constraints);
      }

      if (error.children?.length) {
        const nested = this.parseValidationErrors(error.children, fieldName);
        Object.assign(result, nested);
      }
    }

    return result;
  }
}