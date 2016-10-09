/**
 * By default we use input field that has type='datetime-local'.
 * This input field is natively supported by iOS and Android browsers.
 * When user clicks on a date field, the date field renders "native" UI component:
 * See http://imgur.com/UiFvAdr
 *
 * Unfortunately some desktop browsers do not support it. If we detect such browsers
 * we run our own date picker
 */
let dateInputSupported = undefined;

export default function isDateInputSupported() {
  // checking date support is expensive, so we cache it
  if (dateInputSupported !== undefined) return dateInputSupported;

  dateInputSupported = checkDateInput();

  return dateInputSupported;
}

function checkDateInput() {
  // see http://stackoverflow.com/questions/10193294/how-can-i-tell-if-a-browser-supports-input-type-date
  const input = document.createElement('input');
  input.setAttribute('type', 'datetime-local');

  const notADateValue = 'not-a-date';
  input.setAttribute('value', notADateValue);

  return (input.value !== notADateValue);
}
