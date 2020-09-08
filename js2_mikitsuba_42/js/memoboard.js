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
// - ドラッグ＆ドロップで移動できるようにする
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