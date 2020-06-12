var ss = SpreadsheetApp.getActiveSpreadsheet();

function getColumnsNPipelines(url, token) {
  var newToken = 'Token token='+token;
  
  /* Get columns */
  var columns = getColumns(url, newToken);
  
  /* Get Pipelines */
  var pipelines = getPipelines(url,newToken);
   
  /* Show error */
  if (columns == null || pipelines == null) {
    columns = [{'field':'error','label':'No columns. Could be due to wrong token or missing setup'}]
    pipelines = [{'id':'error','name':'No pipelines. Could be due to wrong token or missing setup'}]
  };
  return {'columns': columns, 'pipelines': pipelines};
}



function generateReport(url, token, columns, data) { 
  var newToken = 'Token token='+token;
  
  /* Get Deals */
  var deals = getDeals(url, newToken, data);
  
  sheetsName = transformDeals(columns, deals)
  
  if (columns.includes('contact_id')) {
    var contactsToFind = deals['contacts']

    var contacts = [] 
    contactsToFind.map(function convert(item) {
      contacts.push(item['id'].toFixed())
    })
    var contactsData = getContacts(url, newToken, contacts)
    
    sheetContacts = transformContacts(contactsData)
    sheetsName = sheetsName.concat(', ',sheetContacts)
    }
  
  if (deals['meta']['total_pages'] == 0) {
    var result = 'No deal available'
  }
  else {
    var result = 'Done. Report added in sheet '+sheetsName;
  }
  return result
}


function transformDeals(columns, deals) {  
  var numColumns = columns.length;
  var rows = [];
 
  /* Map id to name for special columns */
  var specialColumns = {'deal_products':{}, 'deal_stages':{}, 'deal_reasons':{}, 'owners': {}};     
  for (column in specialColumns) {
  if (column == 'owners') { 
    var details = {}
    var data = deals['users']

    if (typeof data !== 'undefined') {
      data.map(function convert(item) {
        details[item['id']] = item['display_name']
      })     
    specialColumns[column] = details
    }}
  else {
      var details = {}
      
      var data = deals[column]
      if (typeof data !== 'undefined') {
        data.map(function convert(item) {
          details[item['id']] = item['name']
        })
      specialColumns[column] = details
    }}
  }
  Logger.log(specialColumns)
  
  /* Transform Deals */
  var dealsData = deals['deals']
  for (i in dealsData) {
    var deal = dealsData[i];
    var row = [];
    for (column in columns) {
      key = columns[column].split('cf_');
      if (key.length == 1) {
        /* For special columns: deal_products, deal_stages, deal_reasons */
        if (key[0].split('_id')[0]+'s' in specialColumns) {
          var keySpecial = key[0].split('_id')[0]+'s';
          if (typeof deal[key[0]] !== 'undefined') {
             row.push(specialColumns[keySpecial][deal[key[0]].toString()])
          }
          else {row.push('')}
        }
        /* For contacts columns that are arrays */
        else if (key[0] == 'contact_id' && typeof deal['contact_ids'][0] !== 'undefined') {row.push(deal['contact_ids'][0].toFixed())} 
        
        /* For normal columns */
        else {row.push(deal[key[0]])}
      }
      /* For custom columns */
      else if (key.length == 2) {
        row.push(deal['custom_field']['cf_'+key[1]]);
      }
    }
    rows.push(row);
  }

  rows.unshift(columns);
  var numRows = rows.length;
  /* var sheetDeals = ss.insertSheet('Deals'+ss.getSheetId().toString()); */
  var sheetDeals = ss.getActiveSheet() /* Replace content at current sheet */
  sheetDeals.clear();
  sheetDeals.getRange(1,1,numRows,numColumns).setValues(rows);
  
  return sheetDeals.getName()
}


function transformContacts(contacts) {
  var columns = ['id','email']
  var numColumns = columns.length;
  var rows = []
  
  contacts.map(function convert(item) {
    rows.push([item['id'].toFixed(),item['email']])
  })
  
  rows.unshift(columns);
  var numRows = rows.length;
  var sheetContacts = ss.insertSheet('Contacts'+ss.getSheetId().toString());
  sheetContacts.getRange(1,1,numRows,numColumns).setValues(rows);
  
  return sheetContacts.getName()
}