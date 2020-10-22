<?php
// common.phpの読み込み
include('./common.php');

// POSTされたデータの代入
$user_id = $_POST['user_id'];
$search = $_POST['search'];

// データベース接続
$pdo = connectDb('mikitsuba_memopad');

// データ取得SQL作成
$stmt = $pdo->prepare("SELECT id FROM memo WHERE user_id = :user_id AND (title LIKE :search OR contents LIKE :search)");
$stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);
$stmt->bindValue(':search', '%'. $search .'%', PDO::PARAM_STR); // %はbindvalueの方でつける http://none.3rin.net/php/php%20pdo%20prepare%E3%81%A7like%EF%BC%88%E9%83%A8%E5%88%86%E4%B8%80%E8%87%B4%EF%BC%89
$status = $stmt->execute();

// データ登録処理後
if($status==false){
    //SQL実行時にエラーがある場合（エラーオブジェクト取得して表示）
    $error = $stmt->errorInfo();
    exit("ErrorMessage:".$error[2]);
} else {
    while($result = $stmt->fetch(PDO::FETCH_ASSOC)){
        $array[] = [
            'id' => $result['id'],
        ];
      }
    header('Content-type: application/json');
    echo json_encode($array, JSON_UNESCAPED_UNICODE);
}