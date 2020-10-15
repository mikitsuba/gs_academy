<html>

<head>
    <meta charset="utf-8">
    <style>
        .menu {
            background-color: #2FA6E9;
        }
    </style>
    <title>GET練習</title>
</head>

<body>
    <div class="menu">
        <h3>menu</h3>
        <ul>
            <li>サンプルフォームに必要な情報を入れる</li>
            <li>form以外の方法でGETを送って見る。</li>
            <li><a href="index.php">index.php</a></li>
        </ul>
    </div>

    <!-- サンプル↓ -->
    <form action="送り先" method="方法">
        お名前: <input type="text" name="送るときの名前">
        EMAIL: <input type="text" name="送るときの名前">
        <input type="submit" value="送信">
    </form>

    <!-- form以外の方法でGETを送って見る。 -->
    <!-- <a href="get_confirm.php">GETを送る</a> -->

</body>

</html>
