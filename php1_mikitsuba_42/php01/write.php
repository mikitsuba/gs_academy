<?php
// ファイルを開く
$file = fopen('./data/data.txt', 'a');

// ファイルのアップロード
$upload_dir = './data/';
$upload = $upload_dir . basename($_FILES['userfile']['name']);
move_uploaded_file($_FILES['userfile']['tmp_name'], $upload);

// ファイルに書き込み
fwrite($file, $_POST['name'].",");
fwrite($file, $_POST['mail'].",");
fwrite($file, $_POST['salary'].",");
fwrite($file, $_POST['jop_type'].","); // \nで改行。これはシングルクォーテーションでは動かない
fwrite($file, $upload."\n");

// ファイルを閉じる
fclose($file);

?>

<html>

<head>
    <meta charset="utf-8">
    <title>File書き込み</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/write_style.css">
</head>

<body>
    <p>ご応募ありがとうございました</p>
    <p>弊社担当者からのご連絡をお待ち下さい</p>
    <ul>
        <li><a href="input.php">戻る</a></li>
    </ul>
</body>

</html>
