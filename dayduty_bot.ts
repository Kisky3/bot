// set timer 07:50
function setTrigger09() {
  var triggerDay = new Date();
  triggerDay.setHours(07);
  triggerDay.setMinutes(50);
  ScriptApp.newTrigger("main").timeBased().at(triggerDay).create();
}

// set timer 17:10
function setTrigger18() {
  var triggerDay = new Date();
  triggerDay.setHours(17);
  triggerDay.setMinutes(10);
  ScriptApp.newTrigger("main").timeBased().at(triggerDay).create();
}

// delete Trigger
function deleteTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for(var i=0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() == "main") {
      ScriptApp.deleteTrigger(triggers[i]);
    }
  }
}

// main method
function main() {
  core_function();
}

function core_function() {

    // Get script sheet URL
    var spreadSheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID');

    // Get the first sheet
    var sheet = spreadSheet.getSheets()[0];

    // Get Rows
    var lastrow = sheet.getLastRow();

    // Get current date
    var currentDay = new Date();

   // To determine if a current date is a workday or not
　　function isWeekDay(currentDate) {
  　　var weekday = currentDate.getDay();
  　　if (weekday == 0 || weekday == 6) {
    　　return false;
  　　}
  　　return true;
　　}

   // To determine whether current date is holiday or not
　　function isEventsForDay(currentDate) {
  　　var calendar = CalendarApp.getCalendarById('ja.japanese#holiday@group.v.calendar.google.com');
  　　if (calendar.getEventsForDay(currentDate, {max: 1}).length > 0) {
    　　return true;
  　　}
  　　return false;
　　}

    // Get name ,date and metion name array
    var name_array = sheet.getSheetValues(2, 1, lastrow, 1);
    var date_array = sheet.getSheetValues(2, 2, lastrow, 1);
    var mention_array = sheet.getSheetValues(2, 3, lastrow, 1);

    // Set date format for today
    var today = Utilities.formatDate(new Date(), "Asia/Tokyo", "yyyy/MM/dd");
    var date = new Array();

    // Roop to get date_number
    var date_num = date_array.length;
    for(var i = 0; i < date_num - 1; i++) {

        // Set date format for date
        date.push(Utilities.formatDate(new Date(date_array[i]), "Asia/Tokyo", "yyyy/MM/dd"));

        // Get index if today = date
        var num = date.indexOf(today);
    }

    // Get name through index we got
    var member = name_array[num];
    var mention = mention_array[num];

    // if it is workday and not holiday then set message
    var message;

    if(member && isWeekDay(currentDay) && !isEventsForDay(currentDay)) {

        message = 'Hey〜！:sunny:\n 今日の当番は　*' + member + '* です！ <@' + mention + '>: \n 本日「加湿器ON/OFF」、「終礼」、「ゴミ捨て」をあなたに任せるよ ！！ \n ※都合が悪い時にみんなに言ってくださいね';

       // Send message to slack
       postSlack(message)
    }

  function postSlack(message) {
    var url = "https://hooks.slack.com/services/xxxxxxxxxx";
    var options = {
      "method" : "POST",
      "headers": {"Content-type": "application/json"},
      "payload" : '{"text":"' + message + '"}'
    };
     // Run here
     UrlFetchApp.fetch(url, options);
  }
}