export default function getSpreadsheetIdFromComponentRoute(component) {
  return component.$route.params.sheetId;
}

