
export const MSG = {
  // Campos básicos
  required      : (field: string) => `${field} es obligatorio`,
  string        : (field: string) => `${field} debe ser texto`,
  email         : () => 'El correo electrónico no tiene un formato válido',
  minLength     : (field: string, min: number) => `${field} debe tener al menos ${min} caracteres`,
  maxLength     : (field: string, max: number) => `${field} no puede tener más de ${max} caracteres`,
  isNotEmpty    : (field: string) => `${field} no puede estar vacío`,
  isNumber      : (field: string) => `${field} debe ser un número`,
  isInt         : (field: string) => `${field} debe ser un número entero`,
  isPositive    : (field: string) => `${field} debe ser un número positivo`,
  isBoolean     : (field: string) => `${field} debe ser verdadero o falso`,
  isArray       : (field: string) => `${field} debe ser un arreglo`,
  isEnum        : (field: string) => `${field} no corresponde a un valor permitido`,
  isDate        : (field: string) => `${field} debe ser una fecha válida`,
  isUrl         : (field: string) => `${field} debe ser una URL válida`,
  isUUID        : (field: string) => `${field} debe ser un UUID válido`,
  notValidValue : (field: string) => `El valor de ${field} no es válido`,
  password      : () => 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un caracter especial',

  // Unicidad y conflictos
  unique        : (field: string) => `Ya existe un registro con ese ${field}`,
  alreadyExists : (entity: string) => `El ${entity} ya existe`,

  // Búsqueda / existencia
  notFound      : (entity: string) => `${entity} no encontrado`,
  notFoundById  : (entity: string) => `No se encontró ningún ${entity} con ese ID`,

  // Autorización
  unauthorized  : () => 'No tienes los roles o permisos necesarios para hacer esta acción',
  forbidden     : () => 'Acceso denegado',
  invalidCredentials: () => 'Correo o contraseña incorrectos',
  inactiveUser: () => 'Usuario inactivo, comunícate con un administrador',
  invalidToken: () => 'Token inválido',

  // Relaciones
  relationNotFound: (relation: string) => `La relación con ${relation} no existe`,

  // Rangos y tamaños
  min           : (field: string, min: number) => `${field} debe ser mayor o igual a ${min}`,
  max           : (field: string, max: number) => `${field} debe ser menor o igual a ${max}`,
  arrayMinSize  : (field: string, min: number) => `${field} debe tener al menos ${min} elemento(s)`,
  arrayMaxSize  : (field: string, max: number) => `${field} no puede tener más de ${max} elemento(s)`,

  // Operaciones
  cannotDelete  : (entity: string) => `No se puede eliminar el ${entity} porque tiene registros asociados`,
  cannotUpdate  : (entity: string) => `No se puede actualizar el ${entity}`,
  inactive      : (entity: string) => `El ${entity} se encuentra inactivo`,
};