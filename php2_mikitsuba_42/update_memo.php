<?php
// common.phpの読み込み
include('./common.php');


// POSTされたデータの代入
$id = $_POST['id'];
$user_id = $_POST['user_id'];
$title = $_POST['title'];
$contents = $_POST['contents'];
$color = $_POST['color'];
$size = $_POST['size'];
$position = $_POST['position'];

// データベース接続
$pdo = connectDb('memopad');

// データアップデートSQL作成
$stmt = $pdo->prepare("UPDATE memo SET title = :title, contents = :contents, color = :color, size = :size, position=:position WHERE id = :id and user_id = :user_id"); //user_idを条件に足しているのは、第三者が偶然にidを取得してしまったときに、編集できないようにするため
$stmt->bindValue(':title', $title, PDO::PARAM_STR);
$stmt->bindValue(':contents', $contents, PDO::PARAM_STR);
$stmt->bindValue(':color', $color, PDO::PARAM_STR);
$stmt->bindValue(':size', $size, PDO::PARAM_STR);
$stmt->bindValue(':position', $position, PDO::PARAM_STR);
$stmt->bindValue(':id', $id, PDO::PARAM_INT);
$stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);
$status = $stmt->execute();

// データ登録処理後
if($status==false){
    //SQL実行時にエラーがある場合（エラーオブジェクト取得して表示）
    $error = $stmt->errorInfo();
    exit("ErrorMessage:".$error[2]);
}

// データ登録SQL作成
$stmt = $pdo->prepare("SELECT user_id FROM memo WHERE id = :id");
$stmt->bindValue(':id', $id, PDO::PARAM_INT);
$status = $stmt->execute();

if($status==false){
    //SQL実行時にエラーがある場合（エラーオブジェクト取得して表示）
    $error = $stmt->errorInfo();
    exit("ErrorMessage:".$error[2]);
  }else{
    $array = [
        'id' => $id,
        'user_id' => $stmt->fetch()[0]
    ];
    header('Content-type: application/json');
    echo json_encode($array, JSON_UNESCAPED_UNICODE);
  }