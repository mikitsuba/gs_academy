// 地図の表示
let map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat:35.6809591, lng:139.7673068}, // 初期表示として、東京駅の位置情報を指定
        zoom: 15
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


// 現在地情報を取得して、startLocationに代入
let startLatLng; // google mapにおけるLatLngオブジェクト
let startCoordinates; // 数字での座標。gurunavi APIに渡すために、数字での経度緯度情報も格納しておく必要がある
function getCurrentLocation() {
    
        navigator.geolocation.getCurrentPosition(
        // 取得成功した場合
            function(position) {
                // google mapにおける、LatLng objectにconvertしなくてはならない
                startCoordinates = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                }
                startLatLng = new google.maps.LatLng(startCoordinates);
            },
            // 取得失敗した場合
            function(error) {
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
            }
        );
}


// 検索の始点となる位置のマーカー
function putStartMarker() {
    const startMarker = new google.maps.Marker({
        map: map,
        position: startLatLng,
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


// 電源・wifiのあるカフェの検索の始点を設定する
function setStartPosition() {
    // search barに何も入力されていない場合は、現在地のlat, lngを取得する
    if ($('#search_bar').val() == '') {
        getCurrentLocation();
                map.setCenter(startLatLng);
                putStartMarker();
    } // search barに文字が入力されている場合
    else {
        // 住所から、緯度・経度情報を取得（geocoding）する https://developers.google.com/maps/documentation/javascript/geocoding?hl=ja
        let geocoder = new google.maps.Geocoder();
        inputAddress = $('#search_bar').val();

        geocoder.geocode( {'address': inputAddress}, function(results, status) {
            if(status == 'OK') {
                startLatLng = results[0].geometry.location;
                startCoordinates = {
                    lat: startLatLng.lat(), // google.maps.LatLng classのメソッド https://developers.google.com/maps/documentation/javascript/reference/coordinates
                    lng: startLatLng.lng()
                }

                map.setCenter(startLatLng);
                putStartMarker();
            } else {
                alert('Geocode was was not successful because of: ' + status);
            }
        });
    }
}


//検索結果の位置マーカーの表示
function putResultMarker(latlng, num) {
    const resultMarker = new google.maps.Marker({
        map: map,
        position: latlng,
        animation: google.maps.Animation.DROP,
        // デザインについてはこちらを参照 https://maps.multisoup.co.jp/blog/1881/
        label: {
            text: String(num),                           //ラベル文字
            color: '#FFFFFF',                    //文字の色
            fontSize: '20px'                     //文字のサイズ
        }
    });

    google.maps.event.addListener(resultMarker, 'click', function(event) {
        $('.search_results').css('display', 'block');
    });
}


// 経度・緯度情報に基づいて、電源・wifiのあるカフェを検索する
let cafes = [];
function searchCafe(lat, lng, distance) {
    const params = {
        keyid: 'e07527755f4f7e9172cc176936dd043a',
        latitude: lat,
        longitude: lng,
        range: distance,
        outret: 1,
        wifi: 1,
        hit_per_page: 100
    }

    axios.get('https://api.gnavi.co.jp/RestSearchAPI/v3/', {
        params:params
    })
    .then(function(response) {
        // wifi/電源のあるレストランの情報を取得して、cafesに格納する
        for (let i = 0; i < response.data.rest.length; i++) {
            latlng = new google.maps.LatLng({lat: Number(response.data.rest[i].latitude), lng: Number(response.data.rest[i].longitude)});

            // 数字をキーにする場合は、ブラケット記法にしなくてはならないのか
            cafes[i] = {
                name: response.data.rest[i].name,
                latlng: latlng,
                url: response.data.rest[i].url,
                mobileUrl: response.data.rest[i].url_mobile,
                address: response.data.rest[i].address,
                opentime: response.data.rest[i].opentime
            }

            // 検索の始点から懸隔されたレストランへの距離・時間を取得。これをforの中で使うとAPIコールの数が増えてしまう気がするけど、とりあえずはこれで実装。後で見直し
            const service = new google.maps.DistanceMatrixService();
            service.getDistanceMatrix(
                {
                    origins: [startLatLng],
                    destinations: [latlng],
                    travelMode: 'WALKING',
                }, (response, status) => {
                    if (status == 'OK') {
                        cafes[i].distance = response.rows[0].elements[0].distance.text;
                        cafes[i].duration = response.rows[0].elements[0].duration.text;
                    }
                });
        }
    })
    .then(function() {
        // cafes.sort((a, b) => {
        //     if(Number(a.duration.slice(0, -1) > b.duration.slice(0, -1))) return -1;
        //     if(Number(a.duration.slice(0, -1) < b.duration.slice(0, -1))) return 1;
        //     return 0;
        // })

        // cafesに格納された各レストランについて、地図上にマーカーを表示し、特定の情報をsearch_resultsに表示する
        for (let i = 0; i < cafes.length; i++) {
            // マーカーの表示
            const resultMarker = new google.maps.Marker({
                map: map,
                position: cafes[i].latlng,
                animation: google.maps.Animation.DROP,
                // デザインについてはこちらを参照 https://maps.multisoup.co.jp/blog/1881/
                label: {
                    text: String(i + 1),                           //ラベル文字
                    color: '#FFFFFF',                    //文字の色
                    fontSize: '20px'                     //文字のサイズ
                }
            });

            // レストラン情報の表示
            const html = `
            <div class="search_result" id="result_${i + 1}">
                <a href="${cafes[i].url}" target="_blank" rel="noopener noreferrer" class="name">${cafes[i].name}</a>
                <span class="distance">${cafes[i].distance}</span>
                <span class="duration">${cafes[i].duration}</span><br>
                <p class="opentime">営業時間：${cafes[i].opentime}</p><br>
                <p class="address">住所：${cafes[i].address}</p>
            </div>`
            $('.search_results').append(html);

            // 地図上に表示されたマーカーをクリックすると、該当するレストラン情報のところにスクロールされる
            google.maps.event.addListener(resultMarker, 'click', function(event) {
                $('.search_results').css('display', 'block');
                $('.search_results').scrollTop($('.search_results').scrollTop() + $('#result_'+ (i + 1)).position().top);
            });
        }
    })
    .catch(function(error) {
        alert(error);//通信Error
    });
}


// 検索ボタンのクリックイベント
$('#search_btn').on('click', function() {
    // これに処理を続けていくなら、setStartにreturn trueを入れて、ifでの場合分けをしたほうがいいかも
    // APIの順番の制御が必要かもしれない　https://qiita.com/im36-123/items/c0678a46ee0f8e44e150
    setStartPosition();
    searchCafe(startCoordinates.lat, startCoordinates.lng);
});
// enterキーのキーダウンイベント
$('body').on('keydown', function(e) {
    // search barにフォーカスがある状態で、enterが入力された場合 https://qastack.jp/programming/11277989/how-to-get-the-focused-element-with-jquery
    if (e.keyCode == 13 && $('#search_bar').is(':focus')) {
        setStartPosition();
        searchCafe(startCoordinates.lat, startCoordinates.lng);
    }
});

$("#close_btn").on('click', function() {
    $('.search_results').css('display', '');
});