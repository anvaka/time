/**
 * Collection of date related utilities
 */

/**
 * Given a string, attempts to parse it
 */
export function convertDateToSheetsDateString(str) {
  const dateObject = new Date(str + 'Z');

  return dateObject.toISOString().substr(0, '2016-09-27T02:10:00'.length)
    .replace(/T/, ' ')
    .replace(/-/g, '/');
}

/**
 * returns current time as an <input type='datetime-local'/> value.
 */
export function getNow() {
  return toDateInputStr(new Date());
}

/**
 * Given a Date object returns its string value that can be set on <input type='datetime-local'/>
 *
 * @see https://www.w3.org/TR/html-markup/input.datetime.html#input.datetime.attrs.value
 */
export function toDateInputStr(date) {
  /* eslint prefer-template: 0 */
  return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds());
}

function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}
