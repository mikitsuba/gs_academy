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
// メモ上で右クリック時には、当該メモのidを取得する
let selectedMemo = '';        //クリックされた要素のid
$('.memo_block').on('contextmenu', function() {
    selectedMemo = $(this).attr('id');
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
    localStorage.setItem('newMemoId', newMemoId);
})


// メモの削除
$('#delete_memo').on('click', function() {
    $('#' + selectedMemo).remove();
    localStorage.removeItem(selectedMemo);
});


// メモの複製
$('#duplicate_memo').on('click', function() {
    const duplicateTitle = $('#' + selectedMemo + ' > .memo_block_title').val();
    const duplicateContents = $('#' + selectedMemo + ' > .memo_block_contents').val();
    const duplicatePosition = $('#' + selectedMemo + ' > .memo_block_title').offset();
    console.log(duplicatePosition.left + 30);

    $('main').append('<div class="memo_block" id="memo' + newMemoId + '"><textarea class="memo_block_title" placeholder="Title...">' + duplicateTitle + '</textarea><textarea class="memo_block_contents" placeholder="Contents...">' + duplicateContents + '</textarea></div>');
    $('#memo' + newMemoId).css('left', (duplicatePosition.left + 30) + 'px');
    $('#memo' + newMemoId).css('top', (duplicatePosition.top + 30) + 'px');

    const memoId = 'memo' + newMemoId;
    const duplicateMemoData = {
        'memoId': memoId,
        'positionX': duplicatePosition.left + 30,
        'positionY': duplicatePosition.top + 30,
        'title': duplicateTitle,
        'contents': duplicateContents
    }

    console.log(duplicateMemoData);

    // 1つのkeyに複数のデータを保存するためには、文字列に変換する必要がある https://www.tam-tam.co.jp/tipsnote/javascript/post5978.html
    localStorage.setItem(memoId, JSON.stringify(duplicateMemoData));

    newMemoId++;
    localStorage.setItem('newMemoId', newMemoId);
});


// memoのドラッグアンドドロップ https://9cubed.info/article/jquery/0037
let isMoving = false; //移動中かどうかのフラグ true:移動中 false:停止中
let clickX, clickY;   //クリックされた位置
let position;         //クリックされた時の要素の位置

//mousedownイベント
$(document).on("mousedown", '.memo_block', function(e) {
    if (isMoving) return; //移動中の場合は処理しない

    isMoving = true; //移動中にする

    //クリックされた座標を保持します
    clickX = e.screenX;
    clickY = e.screenY;

    //クリックされた時の要素の座標を保持します
    position = $(this).position();

    //クリックされた要素のidを保持します
    selectedMemo = $(this).attr('id');
});

//mousemoveイベント
$(document).on("mousemove", 'main', function(e) {
    if (!isMoving) return; //移動中でない場合は処理しない

    //クリックされた時の要素の座標に、移動量を加算したものを、座標として設定します
    $('#' + selectedMemo).css("left", (position.left + e.screenX - clickX) + "px");
    $('#' + selectedMemo).css("top" , (position.top  + e.screenY - clickY) + "px");
});

//mouseupイベント
$(document).on("mouseup",'.memo_block', function(e) {
    if (!isMoving) return; //移動中でない場合は処理しない

    isMoving = false; //停止中にする
});


// localStorageへの保存
// 内容の変更
$(document).on('change', '.memo_block', function(e) {
    const memoId = $(this).attr('id');

    const memoData = {
        'memoId': memoId,
        'positionX': e.currentTarget.offsetLeft,
        'positionY': e.currentTarget.offsetTop,
        'title': e.currentTarget.firstChild.value,
        'contents': e.currentTarget.lastChild.value
    }

    // 1つのkeyに複数のデータを保存するためには、文字列に変換する必要がある https://www.tam-tam.co.jp/tipsnote/javascript/post5978.html
    localStorage.setItem(memoId, JSON.stringify(memoData));
})
// 位置の変更


// リロードしたときの再表示
for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).startsWith('memo')) {
        const memoId = localStorage.key(i)
        const savedMemo = JSON.parse(localStorage.getItem(memoId));

        const positionX = savedMemo['positionX'];
        const positionY = savedMemo['positionY'];
        const title = savedMemo['title'];
        const contents = savedMemo['contents'];

        $('main').append('<div class="memo_block" id="' + memoId + '"><textarea class="memo_block_title" placeholder="Title...">' + title + '</textarea><textarea class="memo_block_contents" placeholder="Contents...">' + contents + '</textarea></div>')
        $('#' + memoId).css('left', positionX);
        $('#' + memoId).css('top', positionY);
    }

    newMemoId = localStorage.getItem('newMemoId');
}

function memo_copy() {

}

function memo_paste() {

}

function memo_delete() {

}

// TODO:
// - 移動したときにlocalstorageが更新されるように
// - 右クリック時は、ドラッグアンドドロップが作動しないようにする
// - サイズを自由に調整できる
// - 付箋の色を選択できる
// - カテゴリを設定できる
// - 重なっているやつは、クリックしたやつを上にもってくる

// 【nice to havs】
// - 可能なら、タイトルはoptionalにする
// - 優先度によるサイズ分け（これは色で分けてもいいかもしれない）
// - メニューバーつけて、カテゴライズ
// - 期限を定めたときのアラーム機能