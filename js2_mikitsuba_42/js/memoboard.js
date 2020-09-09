// 高さを取得して、その値をCSS書き込む（これにより、画面の高さに合わせることができる）
$(document).ready(function () {
    hsize = $(window).height();
    $("body").css("height", hsize + "px");
  });

$(window).resize(function () {
hsize = $(window).height();
$("body").css("height", hsize + "px");
});


// contextmenuのアクション
// 右クリック時に、メニュー表示
$(window).on('contextmenu', function(e) {
    const x = e.pageX;
    const y = e.pageY;
    $('#contextmenu').css('left', x);
    $('#contextmenu').css('top', y);
    $('#contextmenu').css('display', 'block');
});
// 左クリック時に、メニューを非表示に
$(window).on('click', function(e) {
    $('#contextmenu').css('display', 'none');
});


// メモの新規作成
let newMemoId = 0;
$('#new_memo').on('click', function(e) {
    $('main').append('<div class="memo_block" id="memo' + newMemoId + '"><textarea class="memo_block_title" placeholder="Title..."></textarea><textarea class="memo_block_contents" placeholder="Contents..."></textarea></div>')

    const x = e.pageX;
    const y = e.pageY;

    $('#memo' + newMemoId).css('left', x);
    $('#memo' + newMemoId).css('top', y);

    newMemoId++;
})


// memoのドラッグアンドドロップ https://9cubed.info/article/jquery/0037
let isMoving = false; //移動中かどうかのフラグ true:移動中 false:停止中
let clickX, clickY;   //クリックされた位置
let position;         //クリックされた時の要素の位置
let moveMemo;         //クリックされた要素のid

//mousedownイベント
$(document).on("mousedown", '.memo_block', function(e) {
    if (isMoving) {return}; //移動中の場合は処理しない

    isMoving = true; //移動中にする

    //クリックされた座標を保持します
    clickX = e.screenX;
    clickY = e.screenY;

    //クリックされた時の要素の座標を保持します
    position = $(this).position();
    console.log(e);

    //クリックされた要素のidを保持します
    moveMemo = $(this).attr('id');
    console.log(moveMemo);
});

//mousemoveイベント
$(document).on("mousemove", 'main', function(e) {
    if (!isMoving) return; //移動中でない場合は処理しない

    //クリックされた時の要素の座標に、移動量を加算したものを、座標として設定します
    $('#' + moveMemo).css("left", (position.left + e.screenX - clickX) + "px");
    $('#' + moveMemo).css("top" , (position.top  + e.screenY - clickY) + "px");
});

//mouseupイベント
$(document).on("mouseup",'.memo_block', function(e) {
    if (!isMoving) return; //移動中でない場合は処理しない

    isMoving = false; //停止中にする
});


// localStorageへの保存
$(document).on('change', '.memo_block', function(e) {
    const memoId = $(this).attr('id');

    const memoData = {
        'positionX': e.currentTarget.offsetLeft,
        'positionY': e.currentTarget.offsetTop,
        'title': e.currentTarget.firstChild.value,
        'contents': e.currentTarget.lastChild.value
    }

    // 1つのkeyに複数のデータを保存するためには、文字列に変換する必要がある https://www.tam-tam.co.jp/tipsnote/javascript/post5978.html
    localStorage.setItem(memoId, JSON.stringify(memoData));
})


// リロードしたときの再表示
for (let i = 0; i < localStorage.length; i++) {
    const savedMemo = JSON.parse(localStorage.getItem(localStorage.key(i)));

    const positionX = savedMemo['positionX'];
    const positionY = savedMemo['positionY'];
    const title = savedMemo['title'];
    const contents = savedMemo['contents'];

    $('main').append('<div class="memo_block" id="memo' + newMemoId + '"><textarea class="memo_block_title" placeholder="Title...">' + title + '</textarea><textarea class="memo_block_contents" placeholder="Contents...">' + contents + '</textarea></div>')
    $('#memo' + newMemoId).css('left', positionX);
    $('#memo' + newMemoId).css('top', positionY);

    newMemoId++;
}

function memo_copy() {

}

function memo_paste() {

}

function memo_delete() {

}

// TODO:
// - サイズを自由に調整できる
// - 付箋の色を選択できる
// - カテゴリを設定できる
// - copy機能を作る
// - paste機能を作る
// - 削除機能を作る
// - 重なっているやつは、クリックしたやつを上にもってくる

// 【nice to havs】
// - 可能なら、タイトルはoptionalにする
// - 優先度によるサイズ分け（これは色で分けてもいいかもしれない）
// - メニューバーつけて、カテゴライズ
// - 期限を定めたときのアラーム機能