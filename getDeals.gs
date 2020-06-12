function getDetails(url, token,reportType) {
  var newToken = 'Token token='+token;
  
  /* Get columns */
  var results = getColumnsAndFilters(url, newToken, reportType);
   
  /* Show error */
  if (results == null) {
    results = [{'field':'error','label':'No filters. Could be due to wrong token or missing setup'}]
  };
  return {'filters': results['filters'], 'columns': results['columns']};
}


function generateReport(url, token, columnsSelected, filter_options,reportType) { 
  var newToken = 'Token token='+token;
  
  /* Get Deals */
  var deals = getDeals(url, newToken, columnsSelected, filter_options,reportType);
  
  sheetsName = transformDeals(deals)
  
  if (deals['meta']['total'] == 0) {
    var result = 'No deal available'
  }
  else {
    var result = 'Done. Report added in sheet '+sheetsName;
  }
  return result
}


function transformDeals(deals) {
  var numColumns = deals['meta']['headers'].length;
  var columns = deals['meta']['headers'];
  var dealsData = deals['data'];
  var rows = [];
  
  for (i in dealsData) {
    rows.push(dealsData[i]['data'])
  }

  rows.unshift(columns);
  var numRows = rows.length;
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetDeals = ss.getActiveSheet() /* Replace content at current sheet */
  sheetDeals.getRange(1,1,sheetDeals.getMaxRows(),numColumns).clear();
  sheetDeals.getRange(1,1,numRows,numColumns).setValues(rows);
  
  return sheetDeals.getName()
}