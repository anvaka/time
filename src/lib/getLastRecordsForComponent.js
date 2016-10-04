/**
 * Attempts to load last records from the API, and updates component states accordingly
 */
import getSpreadsheetIdFromComponentRoute from './getSpreadsheetIdFromComponentRoute.js';
import {toDateInputStr, getNow} from './dateUtils.js';
import {fetchLastRecords} from './goog.js';

export default function getLastRecordsForComponent(component) {
  // immediately before loading, switch to progress mode:
  component.recordsState = 'loading';

  const spreadsheetId = getSpreadsheetIdFromComponentRoute(component);

  return fetchLastRecords(spreadsheetId)
    .then((response) => {
      // we've got our data!
      component.recordsState = 'loaded';

      const values = response.result.values || [];
      const lastRecords = values.reverse().slice(0, 100);

      component.lastRecords = lastRecords;
      const lastDate = getLastDate(lastRecords);
      if (lastDate) component.start = lastDate;
      else {
        component.start = getNow();
        component.end = getNow();
      }
    }, (response) => {
      console.error('failed to load range', response);
    });
}

function getLastDate(records) {
  if (records.length === 0) return '';

  const lastRecord = records[0];
  if (lastRecord.length < 2) return '';

  const lastEnd = lastRecord[1];

  if (!lastEnd) return '';

  const d = new Date(lastEnd);
  if (Number.isNaN(d.getDate())) return '';

  return toDateInputStr(d);
}
