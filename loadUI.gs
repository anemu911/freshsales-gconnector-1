// Use this code for Google Sheets.
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Freshsales')
      .addItem('Create report', 'openDialog')
      .addToUi();
}

function openDialog(){
  var ui = SpreadsheetApp.getUi();
  var html = HtmlService.createTemplateFromFile("index").evaluate();
  //Once created it becomes a HtmlOutput
  html.setTitle("Freshsales Connector").setWidth(600);
  ui.showSidebar(html);
};


function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
};