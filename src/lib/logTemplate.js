/**
 * This is a template for the default spreadsheet.
 */
export default function createLogTemplate(name) {
  return {
    properties: {
      title: `${name}`,
    },
    sheets: createTimeSheet('Time Log')
  }
}

function createTimeSheet(title) {
  return {
    properties: {
      title,
      gridProperties: {
        // We want the first row to be frozen
        frozenRowCount: 1,
        // And we need only first five columns (start/end/duration/who/what)
        frozenColumnCount: 5,
      },
    },
    data: [createHeaderRow()]
  };
}

function createHeaderRow() {
  return {
    startRow: 0,
    startColumn: 0,
    rowData: {
      values: [
        header('Start'),
        header('End'),
        header('Duration'),
        header('Who?'),
        header('What?')
      ]
    }
  };
}

function header(text) {
  return {
    userEnteredValue: {
      stringValue: text
    },
    userEnteredFormat: {
      horizontalAlignment: 'CENTER',
      textFormat: {
        bold: true,
      },
    },
  };
}
