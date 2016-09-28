import appModel from './appModel.js';

export default init;

const CLIENT_ID = '616901175953-k3qnrg34f7khs5a688k8l51oqn4f15o1.apps.googleusercontent.com';
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/spreadsheets.readonly',
  'https://www.googleapis.com/auth/drive.readonly'
];
let initialized = false;

export function signin(immediate) {
  gapi.auth.authorize({client_id: CLIENT_ID, scope: SCOPES, immediate}, handleAuthResult);
}

function init() {
  if (!gapi.auth) {
    window.initGapi = init;
    return;
  }

  if (initialized) {
    return;
  }

  initialized = true;
  signin(/* immediate = */ true);
}

function handleAuthResult(authResult) {
  const authenticated = authResult && !authResult.error;
  appModel.authStatus = authenticated ? 'ok' : 'error';

  if (authenticated) loadSheetsApi();
}

function loadSheetsApi() {
  gapi.client.load('https://sheets.googleapis.com/$discovery/rest?version=v4').then(gapiReady);
  gapi.client.load('drive', 'v3', listFiles);
}

function gapiReady() {
  appModel.sheetsReady = true;
}

function listFiles() {
  gapi.client.drive.files.list({
    q: "mimeType='application/vnd.google-apps.spreadsheet'",
    pageSize: 100,
  }).execute(response => {
    appModel.files = response.files;
  });
}

export function createFile(name) {
  const fileMetadata = {
    name,
    mimeType: 'application/vnd.google-apps.spreadsheet'
  };

  return gapi.client.drive.files.create({
    resource: fileMetadata,
  }).execute(response => {
    console.log(response);
  });
}
