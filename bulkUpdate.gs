function bulkUpdate(url, token) {
  var url = ''
  var token = 'Token token='
  
  /* Update value*/
  var ss = SpreadsheetApp.openById('')
  var sheet = ss.getSheetByName('Bulk Update')
  var sheetLastRow = sheet.getLastRow()
  var idsRaw = sheet.getRange('A2:A'+sheetLastRow).getValues();
  
  var ids = idsRaw.map(x => x[0])
  var data = {"deal": {"custom_field": {"cf_language": "Chinese"}},
              "ids": ids}
  
  var response = UrlFetchApp.fetch('https://'+url+'.freshsales.io/deals/bulk_update',
                                   {'muteHttpExceptions': true, 
                                    'headers': {'Authorization': token+",'X-NewRelic-ID': 'VQcDVl5UDxABVlNUBgQFUA=='",
                                                'X-Requested-With': 'XMLHttpRequest','Content-Type': "application/json"},
                                    'method' : 'PUT',
                                    'payload': JSON.stringify(data)
                                   })
  
  Logger.log(JSON.parse(response)["message"]);
}
