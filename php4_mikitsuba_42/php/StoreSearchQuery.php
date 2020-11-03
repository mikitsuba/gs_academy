<?php
// POSTされたデータの代入
$user_id = $_POST['search_cafe_user_id'];
$search_query = $_POST['search_query'];


// DB接続
try {
    $pdo = new PDO('mysql:dbname=search_cafe; charset=utf8; host=localhost','root','root');
} catch(PDOException $e) {
    exit('DBConnectError:'.$e->getMessage());
}


// データ登録SQL作成
$stmt = $pdo->prepare("INSERT INTO search(id, user_id, query, time) VALUES (NULL, :user_id, :search_query, sysdate())");
$stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);
$stmt->bindValue(':search_query', $search_query, PDO::PARAM_STR);
$status = $stmt->execute();


// データ登録処理後
if($status==false){
    //SQL実行時にエラーがある場合（エラーオブジェクト取得して表示）
    $error = $stmt->errorInfo();
    exit("ErrorMessage:".$error[2]);
}