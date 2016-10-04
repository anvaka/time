/**
 * extracts sheet id from a component's route
 */
export default function getSpreadsheetIdFromComponentRoute(component) {
  return component.$route.params.sheetId;
}

