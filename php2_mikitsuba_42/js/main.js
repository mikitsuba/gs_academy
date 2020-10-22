// 色の定義
const YELLOW = 'rgb(255, 251, 179)';
const GREEN = 'rgb(83, 163, 180)';
const PINK = 'rgb(255, 179, 221)';
const ORANGE = 'rgb(255, 165, 0)';
const LIGHTBLUE = 'rgb(179, 255, 251)';
const PURPLE = 'rgb(214, 179, 255)';
const GRAY = 'rgb(204, 204, 204)';

// サイズの定義
const SMALL = '200px';
const MEDIUM = '250px';
const LARGE = '300px';


// user_idの取得&保存
let user_id;
$(function() {
    if (!localStorage.getItem('user_id')) {
        user_id = new Date().getTime().toString(16); // idの生成 https://qiita.com/coa00/items/679b0b5c7c468698d53f
        localStorage.setItem('user_id', user_id);
    } else {
        user_id = localStorage.getItem('user_id');
    }
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

// マウスが上にあるときに、サブメニューを表示
$('#color').on('mouseover', function() {
    $('#color>.submenus').css('display', 'block');
});
$('#color').on('mouseout', function() {
    $('#color>.submenus').css('display', '');
});
$('#size').on('mouseover', function() {
    $('#size>.submenus').css('display', 'block');
});
$('#size').on('mouseout', function() {
    $('#size>.submenus').css('display', '');
});

// メモ上で右クリック時には、当該メモのidを取得する
let selectedMemo = '';  //クリックされた要素のid
$('.memo_block').on('contextmenu', function() {
    selectedMemo = $(this).attr('id');
});


// ページ読み込み時のメモの表示
$(function() {
    // Ajax通信開始
    $.ajax({
        url:'./show_memo.php', //送信先
        type:'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data:{
            'user_id': user_id
        }
    })
    // Ajax通信が成功した時
    .done(function(data) {
        for (let i = 0; i < data.length; i++) {
            const id = Number(data[i].id);
            const position = JSON.parse(data[i].position);
            $('main').append('<div class="memo_block" id="' + id + '"><textarea class="memo_block_title" placeholder="Title...">' + data[i].title + '</textarea><textarea class="memo_block_contents" placeholder="Contents...">' + data[i].contents + '</textarea></div>');
            $('#' + id).css('left', position.x + 'px');
            $('#' + id).css('top', position.y + 'px');
            $('#' + id).css('background', data[i].color);
            $('#' + id).css('width', data[i].size);
            $('#' + id).css('height', data[i].size);
        }
    })
    // Ajax通信が失敗した時
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert('ajax通信に失敗しました');
        console.log('jqXHR: ' + jqXHR.status);
        console.log('textStatus: ' + textStatus);
        console.log('errorThrown: ' + errorThrown.message);
    });
});


// メモの新規作成
$('#new_memo').on('click', function(e) {
    // Ajax通信開始
    $.ajax({
        url:'./create_memo.php', //送信先
        type:'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data:{
            'user_id': user_id,
            'color': YELLOW,
            'size': MEDIUM,
            'position': JSON.stringify({x: e.pageX, y: e.pageY})
        }
    })
    // Ajax通信が成功した時
    .done(function(data) {
        const id = Number(data.id);
        $('main').append('<div class="memo_block" id="' + id + '"><textarea class="memo_block_title" placeholder="Title..."></textarea><textarea class="memo_block_contents" placeholder="Contents..."></textarea></div>');
        $('#' + id).css('left', e.pageX + 'px');
        $('#' + id).css('top', e.pageY + 'px');
        $('#' + id).css('background', YELLOW);
        $('#' + id).css('width', MEDIUM);
        $('#' + id).css('height', MEDIUM);
    })
    // Ajax通信が失敗した時
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert('ajax通信に失敗しました');
        console.log('jqXHR: ' + jqXHR.status);
        console.log('textStatus: ' + textStatus);
        console.log('errorThrown: ' + errorThrown.message);
    });
});


// メモ内容の変更
function updateMemo(id, title, contents, color, size, position) {
    // Ajax通信開始
    $.ajax({
        url:'./update_memo.php', //送信先
        type:'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data:{
            'id': id,
            'user_id': user_id,
            'title': title,
            'contents': contents,
            'color': color,
            'size': size,
            'position': JSON.stringify(position)
        }
    })
    // Ajax通信が失敗した時
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert('ajax通信に失敗しました');
        console.log('jqXHR: ' + jqXHR.status);
        console.log('textStatus: ' + textStatus);
        console.log('errorThrown: ' + errorThrown.message);
    });
}
// 内容を変更したとき（changeイベント）
$(document).on('change', '.memo_block', function(e) {
    const id = $(this).attr('id');
    const title = e.currentTarget.firstChild.value;
    const contents = e.currentTarget.lastChild.value;
    const color = e.currentTarget.style.background;
    const size = e.currentTarget.style.width;
    const position = {x: e.currentTarget.offsetLeft, y: e.currentTarget.offsetTop};

    updateMemo(id, title, contents, color, size, position);
})


// メモの削除
$('#delete_memo').on('click', function() {
    // Ajax通信開始
    $.ajax({
        url:'./delete_memo.php', //送信先
        type:'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data:{
            'id': selectedMemo,
            'user_id': user_id,
        }
    })
    // Ajax通信が成功した時
    .done(function(data) {
        $('#' + selectedMemo).remove();
    })
    // Ajax通信が失敗した時
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert('ajax通信に失敗しました');
        console.log('jqXHR: ' + jqXHR.status);
        console.log('textStatus: ' + textStatus);
        console.log('errorThrown: ' + errorThrown.message);
    });
});


// メモの複製
$('#duplicate_memo').on('click', function() {
    const title = $('#' + selectedMemo + ' > .memo_block_title').val();
    const contents = $('#' + selectedMemo + ' > .memo_block_contents').val();
    const color = $('#' + selectedMemo).css('background-color');
    const size = $('#' + selectedMemo).css('width');
    const position = {
        x: $('#' + selectedMemo).offset().left + 30,
        y: $('#' + selectedMemo).offset().top + 30
    }

    $.ajax({
        url:'./create_memo.php', //送信先
        type:'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data:{
            'user_id': user_id,
            'title': title,
            'contents': contents,
            'color': color,
            'size': size,
            'position': JSON.stringify(position)
        }
    })
    // Ajax通信が成功した時
    .done(function(data) {
        const id = Number(data.id);
        $('main').append('<div class="memo_block" id="' + id + '"><textarea class="memo_block_title" placeholder="Title...">' + title + '</textarea><textarea class="memo_block_contents" placeholder="Contents...">' + contents + '</textarea></div>');
        $('#' + id).css('left', position.x + 'px');
        $('#' + id).css('top', position.y + 'px');
        $('#' + id).css('background', color);
        $('#' + id).css('width', size);
        $('#' + id).css('height', size);
    })
    // Ajax通信が失敗した時
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert('ajax通信に失敗しました');
        console.log('jqXHR: ' + jqXHR.status);
        console.log('textStatus: ' + textStatus);
        console.log('errorThrown: ' + errorThrown.message);
    });
});


// メモの色変更
function colorChange(color) {
    const title = $('#' + selectedMemo + ' > .memo_block_title').val();
    const contents = $('#' + selectedMemo + ' > .memo_block_contents').val();
    const position = $('#' + selectedMemo).offset();
    const size = $('#' + selectedMemo).css('width');

    // 色の変更
    $('#' + selectedMemo).css('background', color);

    // function updateMemo(id, title, contents, color, size, position)
    updateMemo(selectedMemo, title, contents, color, size, {x: position.left, y: position.top});
}
// メモの色変更（クリックイベント）
$('#color_yellow').on('click', function() {
    colorChange(YELLOW);
});
$('#color_green').on('click', function() {
    colorChange(GREEN);
});
$('#color_pink').on('click', function() {
    colorChange(PINK);
});
$('#color_orange').on('click', function() {
    colorChange(ORANGE);
});
$('#color_lightblue').on('click', function() {
    colorChange(LIGHTBLUE);
});
$('#color_purple').on('click', function() {
    colorChange(PURPLE);
});
$('#color_gray').on('click', function() {
    colorChange(GRAY);
});


// メモのサイズ変更
function sizeChange(size) {
    const title = $('#' + selectedMemo + ' > .memo_block_title').val();
    const contents = $('#' + selectedMemo + ' > .memo_block_contents').val();
    const position = $('#' + selectedMemo).offset();
    const color = $('#' + selectedMemo).css('background-color');

    $('#' + selectedMemo).css('width', size);
    $('#' + selectedMemo).css('height', size);

    // function updateMemo(id, title, contents, color, size, position)
    updateMemo(selectedMemo, title, contents, color, size, {x: position.left, y: position.top});
}
// サイズ変更（クリックイベント）
$('#size_small').on('click', function() {
    sizeChange(SMALL);
});
$('#size_medium').on('click', function() {
    sizeChange(MEDIUM);
});
$('#size_large').on('click', function() {
    sizeChange(LARGE);
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

    const id = $(this).attr('id');
    // updateMemo(id, title, contents, color, size, position)
    updateMemo(id, e.currentTarget.firstChild.value, e.currentTarget.lastChild.value, e.currentTarget.style.background, e.currentTarget.style.width, {x: e.currentTarget.offsetLeft, y: e.currentTarget.offsetTop});
});


// activeなメモを前面に持ってくる
$(document).on('focus', '.memo_block', function() {
    $(this).css('z-index', '10');
});
$(document).on('blur', '.memo_block', function() {
    $(this).css('z-index', '');
});


// 検索機能
// 右クリックのsearchで、検索ボックス表示
$('#search_memo').on('click', function() {
    $('.search_wrap').css('display', 'block');
});

function searchMemo() {
    // Ajax通信開始
    $.ajax({
        url:'./search_memo.php', //送信先
        type:'POST', //送信方法
        datatype: 'json', //受け取りデータの種類
        data:{
            'user_id': user_id,
            'search': $('#search_bar').val()
        }
    })
    // Ajax通信が成功した時
    .done(function(data) {
        // 検索にヒットするメモがない場合のalert表示
        if (data == null) {
            alert('該当メモなし');
        }

        for (let i = 0; i < data.length; i++) {
             // 検索にヒットしたメモは、赤枠表示
            const id = Number(data[i].id);
            $('#' + id).css('border', 'solid 2px red');

            // 「検索解除」を押したら、赤枠はなくなり、検索ボックスも閉じる
            $('#release').on('click', function() {
                $('#' + id).css('border', '');
                $('.search_wrap').css('display', '');
            });
        }
    })
    // Ajax通信が失敗した時
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert('ajax通信に失敗しました');
        console.log('jqXHR: ' + jqXHR.status);
        console.log('textStatus: ' + textStatus);
        console.log('errorThrown: ' + errorThrown.message);
    });
}
// クリックイベントと、エンターのキープレスイベント
$('#search').on('click', function() {
    searchMemo();
});
$('#search_bar').keypress(function(e) {
    if (e.which === 13) {
        searchMemo();
    }
});