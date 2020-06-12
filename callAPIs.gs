/* Get available columns */

function getColumnsAndFilters(url, token,reportType) {
 
  var response = UrlFetchApp.fetch("https://"+url+".freshsales.io/custom_reports/"+reportType+"/filter_options.json", 
                                   {'muteHttpExceptions': true, 
                                    'headers': {'Authorization': token+",'X-NewRelic-ID': 'VQcDVl5UDxABVlNUBgQFUA=='",
                                                'X-Requested-With': 'XMLHttpRequest','Content-Type': "application/json"},
                                    'method' : 'GET'
                                   });
  
  var rawData = JSON.parse(response);
  var columns = rawData['tabular_data']['select_list']
  var filters = rawData['filter_fields']
  
  return {'columns':columns,'filters': filters}
  
}

/* Get available Deals */
function getDeals(url, token, columnsSelectedClean, filter_options, reportType) {
  
  
  var data = {"category": reportType,
              "rules":{"chart":false,
              "filter_options": filter_options,
                  "table":true,"table_type":"simple","table_options":{"select":columnsSelectedClean,"summarize":[]}}}
  
  
  function getDealsPerPage(url, token, page, data) {
    var response = UrlFetchApp.fetch('https://'+url+'.freshsales.io/custom_reports/filterize?type=table&per_page=100&page='+page.toString(), 
                                   {'muteHttpExceptions': true, 
                                    'headers': {'Authorization': token+",'X-NewRelic-ID': 'VQcDVl5UDxABVlNUBgQFUA=='",
                                                'X-Requested-With': 'XMLHttpRequest','Content-Type': "application/json"},
                                    'method' : 'POST',
                                    'payload': JSON.stringify({
                                             'custom_report': data
                                             })
                                   });
   return JSON.parse(response);
  }
  
  var deals = getDealsPerPage(url, token, 1, data)

  var pages = Math.ceil(deals['meta']['total']/100)
  
  if (pages > 1) {
    for (let i = 2; i<pages+1; i++) {
      deals['data'] = deals['data'].concat(getDealsPerPage(url, token, i, data)['data'])
    }
  }

  return deals
}