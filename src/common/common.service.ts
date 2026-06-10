import { Injectable, NotFoundException } from '@nestjs/common';
import { CONSTANTS_REGISTRY } from './constants.registry';
import { MSG } from './helpers/validation-messages.helper';

@Injectable()
export class CommonService {

  /**
   * Recupera los valores de un enum/constante por su clave en el registro.
   * @param constantName - Nombre de la constante registrada en `CONSTANTS_REGISTRY`.
   * @returns Lista de valores como `string[]`.
   * @throws NotFoundException si la constante no existe.
   */
  getValues(constantName: string): string[] {
    // Buscar el objeto registrado por nombre
    const enumObject = CONSTANTS_REGISTRY[constantName];

    if (!enumObject) {
      // Lanzar excepción clara si no se encuentra
      throw new NotFoundException(
        MSG.notFound(constantName),
      );
    }

    // Devolver solo los valores del objeto
    return Object.values(enumObject);
  }
}