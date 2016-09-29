export default function createLogTemplate(name) {
  return {
    properties: {
      title: `${name}`,
    },
    sheets: {
      properties: {
        title: 'Time Log',
        gridProperties: {
          frozenRowCount: 1,
          frozenColumnCount: 3,
        },
      },
      data: [{
        startRow: 0,
        startColumn: 0,
        rowData: {
          values: [{
            userEnteredValue: {
              stringValue: 'Start'
            },
            userEnteredFormat: {
              horizontalAlignment: 'CENTER',
              textFormat: {
                bold: true,
              },
            },
          }, {
            userEnteredValue: {
              stringValue: 'End'
            },
            userEnteredFormat: {
              horizontalAlignment: 'CENTER',
              textFormat: {
                bold: true,
              },
            },
          }, {
            userEnteredValue: {
              stringValue: 'What?'
            },
            userEnteredFormat: {
              horizontalAlignment: 'CENTER',
              textFormat: {
                bold: true,
              },
            },
          }]
        }
      }]
    }
  }
}
