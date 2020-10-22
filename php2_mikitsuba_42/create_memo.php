<?php
// common.phpの読み込み
include('./common.php');

// POSTされたデータの代入
$user_id = $_POST['user_id'];
$title = $_POST['title'];
$contents = $_POST['contents'];
$color = $_POST['color'];
$size = $_POST['size'];
$position = $_POST['position'];

// データベース接続
$pdo = connectDb('memopad');

// データ登録SQL作成
$stmt = $pdo->prepare("INSERT INTO memo(id, user_id, title, contents, color, size, position) VALUES (NULL, :user_id, :title, :contents, :color, :size, :position)");
$stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);
$stmt->bindValue(':title', $title, PDO::PARAM_STR);
$stmt->bindValue(':contents', $contents, PDO::PARAM_STR);
$stmt->bindValue(':color', $color, PDO::PARAM_STR);
$stmt->bindValue(':size', $size, PDO::PARAM_STR);
$stmt->bindValue(':position', $position, PDO::PARAM_STR);
$status = $stmt->execute();

// データ登録処理後
if($status==false){
    //SQL実行時にエラーがある場合（エラーオブジェクト取得して表示）
    $error = $stmt->errorInfo();
    exit("ErrorMessage:".$error[2]);
  }else{
    // 追加されたデータのIDを取得
    $id = $pdo->lastInsertId('id'); // 競合はしないらしい https://teratail.com/questions/21452
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