<?php
// common.phpの読み込み
include('./common.php');


// POSTされたデータの代入
$id = $_POST['id'];
$user_id = $_POST['user_id'];

// データベース接続
$pdo = connectDb('memopad');

// データアップデートSQL作成
$stmt = $pdo->prepare("DELETE FROM memo WHERE id = :id and user_id = :user_id"); //user_idを条件に足しているのは、第三者が偶然にidを取得してしまったときに、編集できないようにするため
$stmt->bindValue(':id', $id, PDO::PARAM_INT);
$stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);
$status = $stmt->execute();

// データ登録処理後
if($status==false){
    //SQL実行時にエラーがある場合（エラーオブジェクト取得して表示）
    $error = $stmt->errorInfo();
    exit("ErrorMessage:".$error[2]);
}