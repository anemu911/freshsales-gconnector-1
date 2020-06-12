// Current File
var ui = SpreadsheetApp.getUi();

// Use this code for Google Sheets.
function onOpen() {
  SpreadsheetApp.getUi() // Or DocumentApp or SlidesApp or FormApp.
      .createMenu('Freshsales')
      .addItem('Create report', 'openDialog')
      .addToUi();
}

function openDialog(){
  var html = HtmlService.createTemplateFromFile("index").evaluate();
  //Once created it becomes a HtmlOutput
  html.setTitle("Freshsales Connector").setWidth(600);
  ui.showSidebar(html);
};


function include(filename){
  return HtmlService.createHtmlOutputFromFile(filename)
    .getContent();
};