<?php

// データベース接続
function connectDb($db) {
    try {
        $pdo = new PDO('mysql:dbname='.$db.'; charset=utf8; host=localhost','root','root');
    } catch(PDOException $e) {
        exit('DBConnectError:'.$e->getMessage());
    }
    return $pdo;
}


