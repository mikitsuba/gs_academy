<?php
// common.phpの読み込み
include('./common.php');


// POSTされたデータの代入
$user_id = $_POST['user_id'];

// データベース接続
$pdo = connectDb('memopad');

// データ取得SQL作成
$stmt = $pdo->prepare("SELECT * FROM memo where user_id = :user_id");
$stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);
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
            'user_id' => $result['user_id'],
            'title' => $result['title'],
            'contents' => $result['contents'],
            'color' => $result['color'],
            'size' => $result['size'],
            'position' => $result['position'],
        ];
      }
    header('Content-type: application/json');
    echo json_encode($array, JSON_UNESCAPED_UNICODE);
}