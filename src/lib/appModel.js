const appModel = {
  authStatus: 'unknown',
  sheetsReady: false,
  files: [],

  fetchLastRecords,
  logTime,
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
