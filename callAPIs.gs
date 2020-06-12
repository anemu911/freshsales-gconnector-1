/* Get available columns */
function getColumns(url, token) {
 
  var responseColumns = UrlFetchApp.fetch("https://"+url+".freshsales.io/deals/filter_options.json", 
                                   {'muteHttpExceptions': true, 
                                    'headers': {'Authorization': token+",'X-NewRelic-ID': 'VQcDVl5UDxABVlNUBgQFUA=='",
                                                'X-Requested-With': 'XMLHttpRequest','Content-Type': "application/json"},
                                    'method' : 'GET'
                                   });
  return JSON.parse(responseColumns); 
}

/* Get available pipelines */
function getPipelines(url, token) {
 
  var responsePipelines = UrlFetchApp.fetch("https://"+url+".freshsales.io/settings/deal_pipelines?include=deal_stages", 
                                   {'muteHttpExceptions': true, 
                                    'headers': {'Authorization': token+",'X-NewRelic-ID': 'VQcDVl5UDxABVlNUBgQFUA=='",
                                                'X-Requested-With': 'XMLHttpRequest','Content-Type': "application/json"},
                                    'method' : 'GET'
                                   });
  return JSON.parse(responsePipelines)['deal_pipelines'];
}

/* Get available Deals */
function getDeals(url, token, data) {
  
  function getDealsPerPage(url, token, data, page) {
    var response = UrlFetchApp.fetch('https://'+url+'.freshsales.io/deals/filterize?page='+page.toString(), 
                                   {'muteHttpExceptions': true, 
                                    'headers': {'Authorization': token+",'X-NewRelic-ID': 'VQcDVl5UDxABVlNUBgQFUA=='",
                                                'X-Requested-With': 'XMLHttpRequest','Content-Type': "application/json"},
                                    'method' : 'POST',
                                    'payload': JSON.stringify({
                                             'include': 'deal_stage,deal_reason,deal_product,owner,contacts',
                                             'filter_rule': data
                                             })
                                   });
   return JSON.parse(response);
  }
  
  var deals = getDealsPerPage(url, token, data, 1)

  var page = deals['meta']['total_pages']
  var include = ['deal_stages','deal_reasons','deal_products','owners','contacts','deals']
  
  if (page > 1) {
    for (let i = 2; i < page+1; i++) {
      var results = getDealsPerPage(url, token, data, i)
      for (a in include) {
        var key = include[a]
        if (typeof deals[key] !== 'undefined' && typeof results[key] !== 'undefined') {
          deals[key] = deals[key].concat(results[key])
        }
        else if (typeof deals[key] == 'undefined' && typeof results[key] !== 'undefined') {
          deals[key] = results[key]
        }
        else if (typeof deals[key] !== 'undefined' && typeof results[key] == 'undefined') {
          deals[key]
        }
        deals['deals'] = deals['deals'].concat(results['deals'])
      }
    }
  }
  
  
  /* Get unique elements, except for deals */
  for (a in include.slice(0,-1)) {
    var key = include[a]
    if (typeof deals[key] !== 'undefined') {
      deals[key] = Array.from(new Map(deals[key].map(item => [item['id'], item])).values())
    }
  }
  
  return deals
}

/* Get available contacts */
function getContacts(url, token, data) {
  
  function getContactsPerPage(url, token, data, page) {
    var response = UrlFetchApp.fetch('https://'+url+'.freshsales.io/contacts/filterize', 
                                   {'muteHttpExceptions': true, 
                                    'headers': {'Authorization': token+",'X-NewRelic-ID': 'VQcDVl5UDxABVlNUBgQFUA=='",
                                                'X-Requested-With': 'XMLHttpRequest','Content-Type': "application/json"},
                                    'method' : 'POST',
                                    'payload': JSON.stringify({'segment_id':'custom',
                                             'filter_rule': [{"attribute": "id","operator": "is_in","value": data}]
                                             })
                                   });
    return JSON.parse(response);
}

  var contacts = getContactsPerPage(url, token, data, 1)
  var contactsDetails = contacts['contacts']

  var page = contacts['meta']['total_pages']
  
  if (page > 1) {
    for (let i = 2; i < page+1; i++) {
      var results = getContactsPerPage(url, token, data, i)['contacts']
      contactsDetails = contactsDetails.concat(results)
    }
  }

  return contactsDetails
}