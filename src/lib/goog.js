/**
 * The file provides a wrapper on top of google API.
 */
import appModel from './appModel.js';
import createLogTemplate from './logTemplate.js';

// This is my API client id. It's whitelisted only for the following domains
//
// http://localhost:8091
// http://127.0.0.1:8091
// https://time.anvaka.com
// http://time.anvaka.com
//
// So if you want to run this on a different port, you'll need your own client id.
const CLIENT_ID = '616901175953-k3qnrg34f7khs5a688k8l51oqn4f15o1.apps.googleusercontent.com';

// Defines where all time log records are.
//
// By default we are using only three columns:
//
//     A        B       C
// 1  Start    End     What?
// ---------------------------------
// 2    records go here
//
// So, our final range is:
const TIME_RANGE = 'A2:C'

const SCOPES = [
  // We need this to list all spreadsheet files
  'https://www.googleapis.com/auth/drive',
  // We need this to read/write time entries to the spreadsheet.
  'https://www.googleapis.com/auth/spreadsheets',
];

let apiInitialized = false;

/**
 * Attempts to sign in
 * @param {bool} immediate - if true, then login uses "immediate mode", which
 * means that the token is refreshed behind the scenes, and no UI is shown to the user.
 */
export function signIn(immediate) {
  return gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate}, handleAuthResult);
}

export function signOut() {
  return gapi.auth.signOut();
}

/**
 * Gets last entries of a spreadsheet
 */
export function fetchLastRecords(spreadsheetId) {
  return gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: TIME_RANGE,
  });
}

/**
 * Appends log entry to the given spreadsheet.
 */
export function logTime(spreadsheetId, start, end, what) {
  return gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId,
    valueInputOption: 'USER_ENTERED',
    range: TIME_RANGE,
    values: [[start, end, what]],
  });
}

/**
 * Creates a new spreadsheet file with a given name.
 */
export function createSpreadsheet(name) {
  return gapi.client.sheets.spreadsheets.create(createLogTemplate(name)).then(response => {
    const {result} = response;
    appModel.files.unshift({
      id: result.spreadsheetId,
      name
    });

    return result;
  });
}

/**
 * Attempts to refresh auth token in background. If Google Client is not loaded
 * yet, this function prepares window.initializeGoogleApi variable to be called
 * by index.html
 */
export function initializeGoogleApi() {
  if (!gapi.auth) {
    // This means, google client was not yet loaded. We ask index.html
    // to call us when google client script is loaded.
    window.initializeGoogleApi = initializeGoogleApi;

    // And wait until client is loaded...
    return;
  }

  // On the other hand, if we've already initialized the API, we just bail out
  if (apiInitialized) {
    return;
  }

  // First time here - make sure no-one will ever call us again.
  apiInitialized = true;

  // Attempt to sign in in background
  signIn(/* immediate = */ true);
}

/**
 * Extracts error from Google API response
 */
export function getError(response) {
  if (!response) throw new Error('Response is required here');

  if (response.result && response.result.error) {
    return response.result.error.message;
  }

  return 'Unknown error :(';
}


function handleAuthResult(authResult) {
  appModel.authenticated = authResult && !authResult.error;

  if (appModel.authenticated) loadAPIs();
}

function loadAPIs() {
  gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4').then(markGapiReady);
  gapi.client.load('drive', 'v3', listTimeSheetFiles);
}

function markGapiReady() {
  appModel.sheetsAPIReady = true;
}

function listTimeSheetFiles() {
  gapi.client.drive.files.list({
    q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed = false",
    pageSize: 100,
  }).execute(response => {
    appModel.filesLoaded = true;
    appModel.files = response.files;
  });
}

