// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyBC7gb5nNdSsLLErrP10uexkDvr9hPGC3g",
  authDomain: "gsdemo-f5ef1.firebaseapp.com",
  databaseURL: "https://gsdemo-f5ef1.firebaseio.com",
  projectId: "gsdemo-f5ef1",
  storageBucket: "gsdemo-f5ef1.appspot.com",
  messagingSenderId: "414047046002",
  appId: "1:414047046002:web:716697c289d776c0b335eb",
  measurementId: "G-W7WQH30CCF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


// クリックしたアイコンのdata-imgを取得して、icon_idに格納する
let icon_id = '0'; // デフォルトで選択しておく
const imgs = ['buke.png', 'tuku.jpg', 'caram.png'];
$('.imgs').on('click', function() {
  icon_id = $(this).attr('data-img');

  // 選択されたiconを透明でなくする
  switch (icon_id) {
    case '0':
      $('#icon0').css('opacity', '100%');
      $('#icon1').css('opacity', '40%');
      $('#icon2').css('opacity', '40%');
      break;
    case '1':
      $('#icon0').css('opacity', '40%');
      $('#icon1').css('opacity', '100%');
      $('#icon2').css('opacity', '40%');
      break;
    case '2':
      $('#icon0').css('opacity', '40%');
      $('#icon1').css('opacity', '40%');
      $('#icon2').css('opacity', '100%');
  }
});


const ref = firebase.database().ref(); // .ref()は、ブラウザから投稿したら、ユニークキーを自動的に付与する。ref('book')とすると、keyを固定することができる
// 関数定義
function send() {
    // 名前
    let user_name = '';
    if (String($('#user_name').val()) == '') {
      user_name = 'Anonymus';
    } else {
      user_name = $('#user_name').val();
    }

    // テキスト
    let text = String($('#text').val());
    // <br>に変換 https://akinov.hatenablog.com/entry/2014/09/16/235554
    text = text.replace(/(\n|\r)/g, '<br>');
    //日時
    const now = new Date();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    // 1桁の数字について、ゼロ詰めする https://tagamidaiki.com/javascript-0-chink/
    const hour = ('0' + now.getHours()).slice(-2);
    const minute = ('0' + now.getMinutes()).slice(-2);
    const current_time = `${month}/${date}  ${hour}:${minute}`
    //IPアドレス
    let ip = '';
    $.get("https://ipinfo.io", function(response) {
      ip = response.ip;

      // これを外に出したら、ipアドレスが代入されなかった。おそらく、callbackまで一定の時間がかかり、その前に下のコードが実行されてしまうため
      const msg ={
        user_name: user_name,
        icon: icon_id,
        posted_time: current_time,
        text: text,
        ip: ip
       };
      ref.push(msg);
    }, "jsonp");
}


// 受信処理
ref.on('child_added', function(data) {
    const val = data.val(); // 送信されたオブジェクトを取得
    const key = data.key; // ユニークキーの取得
    const message = '<div class="message_wrap" id="' + key + '"><img src="imgs/' + imgs[val.icon] + '" width="30"　" height="30"><div class="chat_wrap"><p class="chat_wrap_user_name">' + val.user_name + '&nbsp;' + val.posted_time + '</p><p class="chat_wrap_contents">' + val.text + '</p></div></div>';
    console.log(key);
    $('#output').append(message);
    $('#output').scrollTop($('#output')[0].scrollHeight);
    let ip;
    
    // IPアドレスにより「自分」を識別子し、自分からのメッセージのみ右に寄せた
    $.get("https://ipinfo.io", function(response) {
      ip = response.ip;
      if (ip == val.ip) {
        $('#' + key).css('justify-content', 'flex-end');
      }
    }, "jsonp");
});

// イベント情報の取得
$('#text').on('keydown', function(e) {
    if (e.keyCode == 13) {
        if (e.shiftKey) {
          // 何もしない関数。コチラ参照 https://qiita.com/ikm/items/4fc4450ed8eb213039d8
          $.noop();
        } else {
          send();
          $('#text').val('');
          // これにより、フォーカスを外す（-> 再度placeholderが表示されるようになる）
          $('#text').blur();
        }
    }
});
