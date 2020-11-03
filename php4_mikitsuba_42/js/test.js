// グローバル変数定義
let searchRange = 2; // 検索する範囲の距離 -- 1: 300m, 2: 500m, 3: 1000m, 4: 2000m
let travelMode = 'WALKING'; // 移動手段 -- WALKING, TRANSIT, DRIVING
let zoom = 16; // ズーム値 -- 0-21


// 地図の表示
let map;
function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:35.6809591, lng:139.7673068}, // 初期表示として、東京駅の位置情報を指定
        zoom: zoom
    });

    // 地図のサイズをwindowのサイズに合わせる（読み込み完了時）
    $(document).ready(function () {
        const windowWidth = $(window).width();
        const windowHeight = $(window).height();
        $("#map").css("width", windowWidth + "px");
        $("#map").css("height", windowHeight + "px");
    });
    // 地図のサイズをwindowのサイズに合わせる（サイズ変更時）
    $(window).resize(function () {
        const windowWidth = $(window).width();
        const windowHeight = $(window).height();
        $("#map").css("width", windowWidth + "px");
        $("#map").css("height", windowHeight + "px");
    });
}


// 現在地情報を取得
function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            // 取得成功した場合
            function(position) {
                const coordinates = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                resolve(coordinates);
            },
            // 取得失敗した場合
            function(error) {
                reject(error);
            }
        );
    });
}


// 検索した場所の位置情報を取得
function getInputAddress(address) {
    return new Promise((resolve, reject) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function(results, status) {
            if(status == 'OK') {
                startLatLng = results[0].geometry.location;
                resolve(startLatLng);
            } else {
                reject('Geocode was was not successful because of: ' + status);
            }
        });
    })
}


// 検索履歴のDBへの登録
function storeSearchQuery(search_query) {
    // idの生成 https://qiita.com/coa00/items/679b0b5c7c468698d53f
    let user_id;
    // localstorageへの保存
    if (!localStorage.getItem('search_cafe_user_id')) {
        user_id = new Date().getTime().toString(16);
        localStorage.setItem('search_cafe_user_id', user_id);
    } else {
        user_id = localStorage.getItem('search_cafe_user_id');
    };

    // Ajax通信開始 https://www.buildinsider.net/web/jqueryref/033
    $.post('./php/StoreSearchQuery.php', {
            'search_cafe_user_id': user_id,
            'search_query': search_query
        }
    )
    // Ajax通信が失敗した時
    .fail(function(jqXHR, textStatus, errorThrown) {
        alert('ajax通信に失敗しました');
        console.log('jqXHR: ' + jqXHR.status);
        console.log('textStatus: ' + textStatus);
        console.log('errorThrown: ' + errorThrown.message);
    });
}


// 検索履歴の表示
function showSearchHistory() {
    const user_id = localStorage.getItem('search_cafe_user_id');

    // Ajax通信開始
    $.get('./php/GetSearchHistory.php', {
        'search_cafe_user_id': user_id,
    })
    // Ajax通信が成功した時
    .done(function(response) {
        if (response != null) {
            // 検索履歴表示の初期化
            $('.search_history').empty();

            // 検索履歴窓の表示
            $('.search_history').css('display', 'block');

            // 検索履歴の重複を除くために、setにする（SQLで試みたが、MySQLではdistinctと（違うキーでの）order byを両立させられない模様）
            let temp_array = [];
            for (let i = 0; i < response.length; i++) {
                temp_array.push(response[i].query);
            }
            const tempSet = Array.from(new Set(temp_array));

            // 検索履歴を検索履歴窓内に表示する
            for (let i = 0; i < 5; i++) {
                const html = `
                    <div class="past_query">${tempSet[i]}</div>
                `
                $('.search_history').append(html);
            }
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


// 検索の始点となる位置のマーカー
function putStartMarker(startPosition) {
    const startMarker = new google.maps.Marker({
        map: map,
        position: startPosition,
        // デザインについてはこちらを参照 https://maps.multisoup.co.jp/blog/1881/
        icon: {
            fillColor: "#0000ff",                //塗り潰し色
            fillOpacity: 0.8,                    //塗り潰し透過率
            path: google.maps.SymbolPath.CIRCLE, //円を指定
            scale: 16,                           //円のサイズ
            strokeColor: "#0000ff",              //枠の色
            strokeWeight: 1.0                    //枠の透過率
        },
        label: {
            text: 'S',                           //ラベル文字
            color: '#FFFFFF',                    //文字の色
            fontSize: '20px'                     //文字のサイズ
        }
    });
}


// 経度・緯度情報に基づいて、電源・wifiのあるカフェを検索する
function searchCafe(array, coordinates, distance, offset) {
    return new Promise((resolve, reject) => {
        // Ajax通信開始
        $.get('https://api.gnavi.co.jp/RestSearchAPI/v3/', {
                keyid: 'e07527755f4f7e9172cc176936dd043a', //ぐるなびのAPIキー
                latitude: Number(coordinates.lat),
                longitude: Number(coordinates.lng),
                range: distance, // 検索の範囲（開始地点からの距離）
                outret: 1, // 電源あり
                wifi: 1, // wifiあり
                hit_per_page: 25,
                offset_page: offset // 検索開始ページ位置
            }
        )
        // Ajax通信が成功した時
        .done(function(response) {
            // wifi/電源のあるレストランの情報を取得して、cafesに格納する
            for (let i = 0; i < response.rest.length; i++) {
                const latlng = new google.maps.LatLng({lat: Number(response.rest[i].latitude), lng: Number(response.rest[i].longitude)});
                array.push({
                        name: response.rest[i].name,
                        latlng: latlng,
                        url: response.rest[i].url,
                        mobileUrl: response.rest[i].url_mobile,
                        address: response.rest[i].address,
                        opentime: response.rest[i].opentime
                    }
                );
            }

            resolve(array);
        })
        // Ajax通信が失敗した時
        .fail(function(error) {
            reject(error);
        });
    });
}


// 検索の始点から、検索の結果見つかったカフェ・レストランへの距離・時間を取得する。
// origins (required): An array containing one or more address strings, google.maps.LatLng objects, or google.maps.Place objects
// destinations (required):   An array containing one or more address strings, google.maps.LatLng objects, or google.maps.Place objects
// travelmode (optional): 'BICYCLING', 'DRIVING' (default), 'TRANSIT', 'WALKING'
function getDistanceDuration(origins, destinations, travelmode) {
    return new Promise((resolve, reject) => {
        const service = new google.maps.DistanceMatrixService();
        // let resultsArray = [];
        // for (let i = 0; i < Math.ceil(destinations.length / 25); i++) {
        //     service.getDistanceMatrix({
        //         origins: origins,
        //         destinations: destinations.slice(i * 25, (i * 25) + 25),
        //         travelMode: travelmode,
        //     }
        //     , (response, status) => {
        //         if (status == 'OK') {
        //             for (let j = 0; j < response.rows[0].elements.length; j++) {
        //                 resultsArray.push(response.rows[0].elements[i]);
        //             }
        //         } else {
        //             reject(status);
        //         }
        //     });
        // }
        // console.log(resultsArray);
        // resolve(resultsArray);
        service.getDistanceMatrix({
            origins: origins,
            destinations: destinations,
            travelMode: travelmode,
        }
        , (response, status) => {
            if (status == 'OK') {
                resolve(response);
            } else {
                reject(status);
            }
        });
    });
}


//検索結果のレストランの表示と対応する位置マーカーの設置
function showResults(cafes) {
    for (let i = 0; i < cafes.length; i++) {
        // マーカーの設置
        const resultMarker = new google.maps.Marker({
            map: map,
            position: cafes[i].latlng,
            animation: google.maps.Animation.DROP,
            // デザインについてはこちらを参照 https://maps.multisoup.co.jp/blog/1881/
            label: {
                text: String(i + 1),                    //ラベル文字
                color: '#FFFFFF',                    //文字の色
                fontSize: '20px'                     //文字のサイズ
            }
        });

        // レストラン情報の表示
        const html = `
        <div class="search_result" id="result_${i + 1}">
            <a href="${cafes[i].url}" target="_blank" rel="noopener noreferrer" class="name">${cafes[i].name}</a>
            <span class="distance">${cafes[i].distance.text}</span>
            <span class="duration">${cafes[i].duration.text}</span><br>
            <p class="opentime">営業時間：${cafes[i].opentime}</p><br>
            <p class="address">住所：${cafes[i].address}</p>
        </div>`
        $('.search_results').append(html);

        // 地図上に表示されたマーカーをクリックすると、該当するレストラン情報のところにスクロールされる
        google.maps.event.addListener(resultMarker, 'click', function() {
            $('.results_box').css('display', 'block');
            $('#result_'+ (i + 1)).css('background-color', 'orange');
        });

        // 地図上に表示されたマーカーをマウスオーバーすると、該当するレストラン情報がハイライトされる
        google.maps.event.addListener(resultMarker, 'mouseover', function() {
            $('#result_'+ (i + 1)).css('background-color', 'orange');
            $('.results_box').scrollTop($('.search_results').scrollTop() + $('#result_'+ (i + 1)).position().top);
        });

        // 地図上に表示されたマーカーからマウスアウトすると、ハイライトがもとに戻る
        google.maps.event.addListener(resultMarker, 'mouseout', function() {
            $('#result_'+ (i + 1)).css('background-color', '');
        });
    }
}


async function main() {
    let startCoordinates;
    let startLatLng;
    let searchHitCafes = [];
    let searchHitLatlng = [];
    // search barに何も入力されていない場合は、現在地のlat, lngを取得する
    const inputAddress = $('#search_bar').val();

    if (inputAddress == '') {
        startCoordinates = await getCurrentLocation().catch((error) => {
            switch(error.code) {
                case 1: //PERMISSION_DENIED
                alert("位置情報の利用が許可されていません");
                break;
                case 2: //POSITION_UNAVAILABLE
                alert("現在位置が取得できませんでした");
                break;
                case 3: //TIMEOUT
                alert("タイムアウトになりました");
                break;
                default:
                alert("その他のエラー(エラーコード:"+error.code+")");
                break;
            }
        });

        // google.maps.LatLng classのメソッド https://developers.google.com/maps/documentation/javascript/reference/coordinates
        startLatLng = new google.maps.LatLng(startCoordinates);
    }
    // search barに文字が入力されている場合は、その位置情報を取得する
    else {
        startLatLng = await getInputAddress(inputAddress).catch((error) => {
            alert(error);
        });

        startCoordinates = {
            lat: startLatLng.lat(),
            lng: startLatLng.lng()
        }

        // 検索履歴のDB保存
        storeSearchQuery(inputAddress);
    }

    // 地図の中心を検索の始点に設定する
    map.setCenter(startLatLng);

    // ズームを調整する
    map.setZoom(zoom);

    // 検索の始点にマーカーを設置する
    putStartMarker(startLatLng);

    // 検索の始点から一定の距離内にある、電源・wifiのあるカフェを検索する
    searchHitCafes = await searchCafe([], startCoordinates, searchRange).catch((error) => {
        if (error.responseJSON.error[0].message == '指定された条件の店舗が存在しません') {
            alert('該当する店が見つかりませんでした。条件を変えてください');
            console.log('status: ' + error.status);
            console.log('textStatus: ' + error.statusText);
        } else {
            alert('ajax通信に失敗しました');
            console.log('status: ' + error.status);
            console.log('textStatus: ' + error.statusText);
        }
    });

    // 検索の支店から、検索結果であるカフェへの距離・所要時間を取得する
    // searchHitCafesの要素1つずつについて、Distance Matrix APIをコールすると一気にAPIコール数が増えてしまうため、位置情報の配列を作って1回APIをコールした上で、結果をsearchHitCafesに入れ直す
    for (let i = 0; i < searchHitCafes.length; i++) {
        searchHitLatlng.push(searchHitCafes[i].latlng);
    }

    const distanceDurationArray = await getDistanceDuration([startLatLng], searchHitLatlng, travelMode).catch(error => {
        alert(error);
    });
    console.log(distanceDurationArray);

    // 取得したカフェへの距離・所要時間をsearchHitCafesに追加する
    for (let i = 0; i < searchHitCafes.length; i++) {
        searchHitCafes[i].distance = {
            text: distanceDurationArray.rows[0].elements[i].distance.text,
            value: distanceDurationArray.rows[0].elements[i].distance.value,
        }

        searchHitCafes[i].duration = {
            text: distanceDurationArray.rows[0].elements[i].duration.text,
            value: distanceDurationArray.rows[0].elements[i].duration.value,
        }
    }

    // searchHitCafesを、duration.valueをkeyとしてソートする https://www.sejuku.net/blog/62904
    searchHitCafes.sort(function(a, b) {
        if (a.duration.value > b.duration.value) {
          return 1;
        } else {
          return -1;
        }
    })

    // 取得したカフェにマーカーを設置する
    showResults(searchHitCafes);
}


// 検索ボタンのクリックイベント
$('#search_btn').on('click', function(){
        // 前回の検索結果を削除する
        $('.search_results').empty();

        // メイン処理の実施
        main();

        // 検索オプションの非表示
        $('.search_settings').css('display', '');

        // 検索履歴窓の非表示
        $('.search_history').css('display', '');
});

// enterキーのキーダウンイベント
$('body').on('keydown', function(e) {
    // search barにフォーカスがある状態で、enterが入力された場合 https://qastack.jp/programming/11277989/how-to-get-the-focused-element-with-jquery
    if (e.keyCode == 13 && $('#search_bar').is(':focus')) {
        // 前回の検索結果を削除する
        $('.search_results').empty();

        // メイン処理の実施
        main();

        // 検索オプションの非表示
        $('.search_settings').css('display', '');

        // 検索履歴窓の非表示
        $('.search_history').css('display', '');
    }
});

// マウスフォーカスで、検索履歴の表示
$('#search_bar').on('focus', function() {
    showSearchHistory();
    $('.search_settings').css('display', '');
});

// 検索履歴のクリックで、検索フォームへの入力
$(document).on('click', '.past_query', function() {
    const past_query = $(this).text();
    $('#search_bar').val(past_query);
    $('.search_history').css('display', '');
});

// 検索オプション表示
$('#search_settings_btn').on('click', function() {
    $('.search_settings').css('display', 'block');
    $('.search_history').css('display', '');
});

// 検索オプション（検索する範囲の距離）
$('.search_range').on('click', function() {
    searchRange = Number($(this).attr('id'));
    $('.search_range').css('color', '#666');
    $(this).css('color', 'blue');
    console.log(searchRange);

    // ズームの調整
    switch (searchRange) {
        case 1:
            zoom = 17;
            break;
        case 2:
        case 3:
            zoom = 16;
            break;
        case 4:
            zoom = 15;
    }
});

// 検索オプション（検索する範囲の距離）
$('.travel_mode').on('click', function() {
    travelMode = $(this).attr('id');
    $('.travel_mode').css('color', '#666');
    $(this).css('color', 'blue');
});

// 検索結果ウィンドウのクローズ
$("#close_btn").on('click', function() {
    $('.results_box').css('display', '');
});
