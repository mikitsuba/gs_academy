<?php
// GETされたデータの代入
$user_id = $_GET['search_cafe_user_id'];


// DB接続
try {
    $pdo = new PDO('mysql:dbname=search_cafe; charset=utf8; host=localhost','root','root');
} catch(PDOException $e) {
    exit('DBConnectError:'.$e->getMessage());
}


// データ登録SQL作成
$stmt = $pdo->prepare("SELECT query, time FROM search WHERE user_id = :user_id ORDER BY time DESC;");
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
            'query' => $result['query'],
        ];
      }
    header('Content-type: application/json');
    echo json_encode($array, JSON_UNESCAPED_UNICODE);
}