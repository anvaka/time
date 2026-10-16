/**
 * The file provides a wrapper on top of Google API.
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

// We use this to quickly lookup sheet name by their id.
// See getSheetTitle() method
const sheetIdToTitle = new Map();

let apiInitialized = false;
let tokenClient = null;

function initTokenClient(callback) {
  if (tokenClient) {
    if (callback) callback();
    return;
  }

  if (window.google && window.google.accounts && window.google.accounts.oauth2) {
    tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES.join(' '),
      callback: handleTokenResponse,
    });
    if (callback) callback();
  } else {
    setTimeout(() => initTokenClient(callback), 50);
  }
}

function handleTokenResponse(tokenResponse) {
  if (tokenResponse && tokenResponse.error) {
    appModel.authenticated = false;
    return;
  }

  if (tokenResponse && tokenResponse.access_token) {
    const expiresIn = Number(tokenResponse.expires_in) || 3600;
    tokenResponse.expires_at = Date.now() + (expiresIn * 1000);
    localStorage.setItem('gapi_token', JSON.stringify(tokenResponse));
    gapi.client.setToken(tokenResponse);
    appModel.authenticated = true;
    listTimeSheetFiles();
  }
}

/**
 * Attempts to sign in
 */
export function signIn() {
  initTokenClient(() => {
    tokenClient.requestAccessToken({ prompt: '' });
  });
}

export function signOut(callback) {
  const token = gapi.client && gapi.client.getToken();
  localStorage.removeItem('gapi_token');

  function forwardCallback() {
    if (gapi.client) {
      gapi.client.setToken(null);
    }
    cleanAppModel();
    if (callback) callback();
  }

  const hasGis = window.google && window.google.accounts && window.google.accounts.oauth2;
  if (token && token.access_token && hasGis) {
    try {
      window.google.accounts.oauth2.revoke(token.access_token, forwardCallback);
      return;
    } catch (e) {
      forwardCallback();
      return;
    }
  }

  forwardCallback();
}

function cleanAppModel() {
  appModel.filesLoaded = false;
  appModel.files = [];
  appModel.authenticated = false;
}

/**
 * Gets last entries of a spreadsheet
 */
export function fetchLastRecords(spreadsheetId) {
  return gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId,
    range: TIME_RANGE,
  }).then(id, checkError);
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
  }).then(id, checkError);
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
  }, checkError);
}

/**
 * Checks for a restored session from localStorage, or marks unauthenticated.
 */
function checkStoredSession() {
  const savedTokenStr = localStorage.getItem('gapi_token');
  if (savedTokenStr) {
    try {
      const savedToken = JSON.parse(savedTokenStr);
      const isNotExpired = savedToken && Date.now() < (savedToken.expires_at - 60000);
      if (savedToken && savedToken.access_token && isNotExpired) {
        gapi.client.setToken(savedToken);
        appModel.authenticated = true;
        listTimeSheetFiles();
        return;
      }
    } catch (e) {
      localStorage.removeItem('gapi_token');
    }
  }

  appModel.authenticated = false;
}

/**
 * Initializes Google Client and Google Identity Services.
 */
export function initializeGoogleApi() {
  if (typeof gapi === 'undefined' || !gapi.load) {
    window.initializeGoogleApi = initializeGoogleApi;
    return;
  }

  if (apiInitialized) {
    return;
  }

  apiInitialized = true;

  initTokenClient();

  gapi.load('client', () => {
    Promise.all([
      gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4'),
      gapi.client.load('drive', 'v3')
    ]).then(() => {
      appModel.sheetsAPIReady = true;
      checkStoredSession();
    }, () => {
      appModel.authenticated = false;
    });
  });
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

/**
 * Gets a title of a sheet
 */
export function getSheetTitle(spreadsheetId, callback) {
  if (sheetIdToTitle.has(spreadsheetId)) {
    const title = sheetIdToTitle.get(spreadsheetId);
    setTimeout(() => callback(title), 0);
    return;
  }

  gapi.client.sheets.spreadsheets.get({
    spreadsheetId,
    fields: 'properties/title'
  }).then(response => {
    const title = get(response, 'result.properties.title');
    sheetIdToTitle.set(spreadsheetId, title);
    callback(title);
  });
}

function listTimeSheetFiles() {
  if (!gapi.client || !gapi.client.drive) return;

  gapi.client.drive.files.list({
    q: "mimeType='application/vnd.google-apps.spreadsheet' and trashed = false",
    pageSize: 100,
  }).execute(response => {
    appModel.filesLoaded = true;
    appModel.files = (response && response.files) || [];
    makeTitleIndex(appModel.files);
  }, checkError);
}

function makeTitleIndex(files) {
  files.forEach(file => {
    sheetIdToTitle.set(file.id, file.name);
  });
}

function get(obj, path) {
  if (!obj) return obj;

  const parts = path.split('.');
  for (let i = 0; i < parts.length; ++i) {
    const key = parts[i];
    obj = obj[key];
    if (!obj) return obj;
  }

  return obj;
}

function id(x) { return x; }

function checkError(response) {
  if (response && response.status === 401) {
    // this is invalid auth. Clear token and refresh page
    localStorage.removeItem('gapi_token');
    if (gapi.client) {
      gapi.client.setToken(null);
    }
    appModel.authenticated = false;
    window.location.reload();
  }

  return response;
}
