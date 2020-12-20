function doPost(e) {
  //シート1はシート名に応じて変更
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1');

  //先ほど控えたOutgoing Webhookのトークン
  var token = 'xxxxxx'

  //送られてきたトークンが正しければ勤怠を記録する
  
  //parameterは必要に応じて変更してください
  if (token == e.parameter.token){
    var user    = e.parameter.user_name;
    var datetime     = new Date();
    var date         = (datetime.getFullYear() + '/' + ('0' + (datetime.getMonth() + 1)).slice(-2) + '/' + ('0' + datetime.getDate()).slice(-2))
    var time         = (('0' + datetime.getHours()).slice(-2) + ':' + ('0' + datetime.getMinutes()).slice(-2));
    var trigger_word = e.parameter.trigger_word;
    //var text         = e.parameter.text;

    
    var rows = sheet.getDataRange().getValues();  
    var ret = findRow( rows, date, user );
    
    if ( ret >= 0 ) {　// 既にデータがあるから、書き換え
      var array = rows[ ret ];
      
      if( array.length < 4 ) {
        array = [ array[0], array[1], array[2], '' ];
      }
      
      if ( trigger_word == '出勤' ) {
        sheet.getRange( ret+1, 3 ).setValue( time );
      } else {
        sheet.getRange( ret+1, 4 ).setValue( time );
      }
      
    }
    else { // 追記する
      if ( trigger_word == '出勤' ) {
        var array = [date, user, time, '' ];
      } else {
        var array = [date, user, '', time ];
      }
      
      sheet.appendRow( array );
      
    }

  }

  return
}

/**
データが見つかったら、正の値、見つからなかったら-1を返す
*/
function findRow( rows, date, user ) {
  
  var date = Date.parse( date );
  
  for ( var i=rows.length-1; i >= 0; i-- ) {

    // 取得したデータが、Dateオブジェクトか？をチェックする
    var date_row = rows[i][0];
    if( 'object' == typeof( date_row ) && Object.prototype.toString.call( date_row ).slice(8, -1) == 'Date' ) {
      var date_row_time = date_row.getTime();
      if ( date_row_time == date && rows[i][1] == user ) {
        return i;
      } else if ( date_row_time < date ) {
        return -1;
      }
    }
  }
  
  return -1;
}

function Attendance_Format() {
  
  //変数定義
  var spreadsheet = SpreadsheetApp.getActive();
  var sh = spreadsheet.getActiveSheet();
  var last_row = spreadsheet.getLastRow();
  
  //社員名を検索して従業員コードとフリガナを挿入し文字を置き換える
 for (var i = 1; i < last_row; i++) {
  
  // 行のデータを取得する
  var range = sh.getRange(i + 1, 2);
  
   // E列に休憩時間の1:00が入る
  sh.getRange(i + 1, 5).setValue('1:00');
   
  // F列に就業時間の計算結果が反映される
  var formula = "=D" + (i + 1) + "-C" + (i + 1) + "-E" + (i + 1)
  sh.getRange(i + 1, 6).setValue(formula) 
  
  // IDをSlack表記から従業員コード + 苗字 に変更する
  
  if(range.getValue() === 'name'){
    var name = sh.getRange(i + 1, 2).getValue();
    var id = name.replace('name', 'dakoku');
    sh.getRange(i + 1, 2).setValue(id);
   }
	if(range.getValue() === 'name2'){
    var name = sh.getRange(i + 1, 2).getValue();
    var id = name.replace('name2', 'dakoku');
    sh.getRange(i + 1, 2).setValue(id);
   }
   
  //for文終了
  }
  
  //ログ記入
  console.log(range.getValue()); 
}
