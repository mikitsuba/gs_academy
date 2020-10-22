<?php

// データベース接続
function connectDb($db) {
    try {
        $pdo = new PDO('mysql:dbname='.$db.'; charset=utf8; host=mysql1015.db.sakura.ne.jp','mikitsuba','tsubasa4997');
    } catch(PDOException $e) {
        exit('DBConnectError:'.$e->getMessage());
    }
    return $pdo;
}


