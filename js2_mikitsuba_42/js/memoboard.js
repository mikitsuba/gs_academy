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

    // 右クリック時は、ドラッグアンドドロップでの移動を止める
    isMoving = false;
});
// 左クリック時に、メニューを非表示に
$(window).on('click', function(e) {
    $('#contextmenu').css('display', 'none');
});
// メモ上で右クリック時には、当該メモのidを取得する
let selectedMemo = '';  //クリックされた要素のid
$('.memo_block').on('contextmenu', function() {
    selectedMemo = $(this).attr('id');
});


// メモの新規作成
function createMemo(memoId, positionX, positionY, color, title, contents) {
    $('main').append('<div class="memo_block" id="' + memoId + '"><textarea class="memo_block_title" placeholder="Title...">' + title + '</textarea><textarea class="memo_block_contents" placeholder="Contents...">' + contents + '</textarea></div>');
    $('#' + memoId).css('left', positionX);
    $('#' + memoId).css('top', positionY);
    $('#' + memoId).css('background', color);
}

let newMemoId = 0;
$('#new_memo').on('click', function(e) {
    const memoId = 'memo' + newMemoId
    const positionX = e.pageX;
    const positionY = e.pageY;
    const color = 'rgb(255, 251, 179)';
    createMemo(memoId, positionX, positionY, color, '', '');

    storeMemo(memoId, positionX, positionY, color, '', '');

    newMemoId++;
    // リロードされた後に新規メモが作成された際にもidがかぶらないようにするため、newMemoIdもlocalstorageに格納する
    localStorage.setItem('newMemoId', newMemoId);
})


// メモ内容のlocalstorage保存
function storeMemo(memoId, positionX, positionY, color, title, contents) {
    const memoData = {
        'memoId': memoId,
        'positionX': positionX,
        'positionY': positionY,
        'color': color,
        'title': title,
        'contents': contents
    }

    // 1つのkeyに複数のデータを保存するためには、文字列に変換する必要がある https://www.tam-tam.co.jp/tipsnote/javascript/post5978.html
    localStorage.setItem(memoId, JSON.stringify(memoData));
}


// メモの削除
$('#delete_memo').on('click', function() {
    $('#' + selectedMemo).remove();
    localStorage.removeItem(selectedMemo);
});


// メモの複製
$('#duplicate_memo').on('click', function() {
    const duplicateMemoId = 'memo' + newMemoId;
    const duplicatePosition = $('#' + selectedMemo).offset();
    const duplicateColor = $('#' + selectedMemo).css('background');
    const duplicateTitle = $('#' + selectedMemo + ' > .memo_block_title').val();
    const duplicateContents = $('#' + selectedMemo + ' > .memo_block_contents').val();

    createMemo(duplicateMemoId, (duplicatePosition.left + 30), (duplicatePosition.top + 30), duplicateColor, duplicateTitle, duplicateContents);

    storeMemo(duplicateMemoId, (duplicatePosition.left + 30), (duplicatePosition.top + 30), duplicateColor, duplicateTitle, duplicateContents);

    newMemoId++;
    localStorage.setItem('newMemoId', newMemoId);
});


// メモの色変更
function colorChange(red, green, blue) {
    $('#' + selectedMemo).css('background', 'rgb(' + red +  ', ' + green + ', ' + blue + ')');
    const memoId = selectedMemo;
    const position = $('#' + selectedMemo).offset();
    const newColor = 'rgb(' + red +  ', ' + green + ', ' + blue + ')';
    const title = $('#' + selectedMemo + ' > .memo_block_title').val();
    const contents = $('#' + selectedMemo + ' > .memo_block_contents').val();
    storeMemo(memoId, position.left, position.top, newColor, title, contents);
}

$('#color_yellow').on('click', function() {
    colorChange(255, 251, 179);
});
$('#color_green').on('click', function() {
    colorChange(83, 163, 180);
});
$('#color_pink').on('click', function() {
    colorChange(255, 179, 221);
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

    const memoId = $(this).attr('id');
    storeMemo(memoId, e.currentTarget.offsetLeft, e.currentTarget.offsetTop, e.currentTarget.style.background, e.currentTarget.firstChild.value, e.currentTarget.lastChild.value);
});


// 内容の変更のlocalStorageへの保存
$(document).on('change', '.memo_block', function(e) {
    const memoId = $(this).attr('id');
    console.log(e);
    storeMemo(memoId, e.currentTarget.offsetLeft, e.currentTarget.offsetTop, e.currentTarget.style.background, e.currentTarget.firstChild.value, e.currentTarget.lastChild.value);
})


// リロードしたときの再表示
for (let i = 0; i < localStorage.length; i++) {
    if (localStorage.key(i).startsWith('memo')) {
        const savedMemoId = localStorage.key(i)
        const savedMemo = JSON.parse(localStorage.getItem(savedMemoId));

        const savedPositionX = savedMemo['positionX'];
        const savedPositionY = savedMemo['positionY'];
        const savedColor = savedMemo['color'];
        const savedTitle = savedMemo['title'];
        const savedContents = savedMemo['contents'];

        createMemo(savedMemoId, savedPositionX, savedPositionY, savedColor, savedTitle, savedContents);
    }

    newMemoId = localStorage.getItem('newMemoId');
}

// TODO:
// - サイズを自由に調整できる
// - 付箋の色を選択できる
// - カテゴリを設定できる
// - 重なっているやつは、クリックしたやつを上にもってくる

// 【nice to havs】
// - 可能なら、タイトルはoptionalにする
// - 優先度によるサイズ分け（これは色で分けてもいいかもしれない）
// - メニューバーつけて、カテゴライズ
// - 期限を定めたときのアラーム機能