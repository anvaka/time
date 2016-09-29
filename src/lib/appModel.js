import createLogTemplate from './logTemplate.js';

const appModel = {
  authStatus: 'unknown',
  sheetsReady: false,
  files: [],

  fetchLastRecords,
  logTime,
  createFile,
};

export default appModel;

function fetchLastRecords(spreadsheetId) {
  return gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: 'A2:C',
  });
}

function logTime(spreadsheetId, start, end, what) {
  return gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId,
    valueInputOption: 'USER_ENTERED',
    range: 'A2:C',
    values: [[start, end, what]],
  });
}

function createFile(name) {
  return gapi.client.sheets.spreadsheets.create(createLogTemplate(name)).then(response => {
    const {result} = response;
    appModel.files.unshift({
      id: result.spreadsheetId,
      name
    });

    return result;
  });
}
