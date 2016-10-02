/**
 * This is the data model of our application.
 */
const appModel = {
  // Authenticated can be undefined, true or false. If it is undefined
  // then we haven't attemted authentication yet.
  authenticated: undefined,
  sheetsAPIReady: false,
  filesLoaded: false,
  files: [],
};

export default appModel;
