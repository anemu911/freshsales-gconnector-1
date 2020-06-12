function schedule() {
  var url = ''
  var token = ''
  
  var today = new Date();
  var dateStart = Utilities.formatDate(new Date(today.getFullYear(), today.getMonth()), 'GMT+8', 'dd/MM/yyyy')
  var dateEnd = Utilities.formatDate(new Date(new Date(today.getFullYear(), today.getMonth()+1) - 1), 'GMT+8', 'dd/MM/yyyy')
  
  /*---------Update value + date---------*/
  var columnsSelected = {"Lead":[{"field":"created_at","model":"Lead","field_label":"created_at","parent_model":"Lead","label":"Created at","type":"datetime","default":null}]}
  var reportType = 'leads_with_converted'
  var sheetName = 'Lead'
  generateReportSchedule(url, token, columnsSelected, filter_options, reportType, sheetName)
  
}

/* Spreadsheet */


function generateReportSchedule(url, token, columnsSelected, filter_options, reportType, sheetName) { 
  var newToken = 'Token token='+token;
  
  /* Get Deals */
  var deals = getDeals(url, newToken, columnsSelected, filter_options,reportType);
  
  transformDealsSchedule(deals, sheetName)
}


function transformDealsSchedule(deals, sheetName) {
  var numColumns = deals['meta']['headers'].length;
  var columns = deals['meta']['headers'];
  var dealsData = deals['data'];
  var rows = [];
  
  for (i in dealsData) {
    rows.push(dealsData[i]['data'])
  }

  rows.unshift(columns);
  var numRows = rows.length;
  var ssSchedule = SpreadsheetApp.openById('');
  var sheetDeals = ssSchedule.getSheetByName(sheetName)
  /* var sheetDeals = ssSchedule.getActiveSheet() /* Replace content at current sheet */
  sheetDeals.getRange(1,1,sheetDeals.getMaxRows(),numColumns).clear();
  sheetDeals.getRange(1,1,numRows,numColumns).setValues(rows);
}