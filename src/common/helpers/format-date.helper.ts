const BASE_OPTIONS: Intl.DateTimeFormatOptions = {
  year    : 'numeric',
  month   : 'numeric',
  day     : 'numeric',
  hour    : '2-digit',
  minute  : '2-digit',
  timeZone : 'America/Bogota'
};

export function formatDate(date: Date, locale = 'es-CO', options = BASE_OPTIONS) {
  return new Intl.DateTimeFormat(locale, options).format(new Date(date));
}