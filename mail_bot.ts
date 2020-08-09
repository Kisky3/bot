function mailSend() {
  /* 名前を取得 */
  var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var getName = activeSpreadsheet.getRange("D2").getValue().trim();
  var masterName = getName.replace(/　/g, ""); //スペース削除

  /* SD日報設定ファイルから情報を取得 */
  var settingUrl = "YOUR_SHEET";
  var settingSpreadsheet= SpreadsheetApp.openByUrl(settingUrl);
  var settingSheet = settingSpreadsheet.getSheetByName("mail");
  var lastRow = settingSheet.getLastRow() + 1;

  for(var i = 1;i < lastRow;i++){
    var setName = settingSheet.getRange(i,1).getValue();
    if(setName == masterName){
      var strCc = settingSheet.getRange(i,4).getValue(); //宛先
      var strFrom = settingSheet.getRange(i,2).getValue(); //差出アドレス
    }
  }

  /* メールデータの準備 */
  var strUrl = activeSpreadsheet.getUrl();
  var strGid = activeSpreadsheet.getSheetId();
  var strDate = Utilities.formatDate(new Date(),"JST","MM/dd");
  var strSubject = "【業務日報】" + strDate + " " + masterName;
  var strBody = strUrl + "#gid=" + strGid;
 
  /* メールを送信 */
  GmailApp.sendEmail(
    "",
    strSubject,
    strBody,
    {
      cc:strCc,
      from:strFrom,
      name: masterName
    }
  );
}
