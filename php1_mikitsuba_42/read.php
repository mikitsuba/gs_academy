<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>応募者表示</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/read_style.css">
</head>
<body>
    <table>
        <tr>
            <th>name</th>
            <th>e-mail</th>
            <th>salary</th>
            <th>job type</th>
            <th>resume</th>
        </tr>
        <?php
            // ファイルを開く
            $file = fopen('./data/data.txt', 'r');

            // ファイル内容を1行ずつ読み込んで出力
            while (!feof($file)) {
                $text = fgets($file); // nl2br()は、改行をbrに変換する
                $array = explode(",", $text);
                if ($text != '') { // 最後の1行が改行により空になっているので、条件を入れる
                    echo '<tr>';
                    for ($i = 0; $i < count($array) - 1; $i++) {
                        echo '<td>'.$array[$i].'</td>';
                    }
                    echo '<td><a href="'.$array[4].'" target="_blank" rel="noopener noreferrer">ファイル</a></td>';
                    echo '</tr>';
                }
            }
            // ファイルを閉じる
            fclose($file);
        ?>
    </table>
</body>
</html>