<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>課題テンプレート</title>
    <link rel="stylesheet" href="css/reset.css">
    <link rel="stylesheet" href="css/input_style.css">
</head>
<body>
    <h3 class="title">履歴書投稿フォーム</h3>
    <form class="form" enctype="multipart/form-data" action="write.php" method="post">
        <table class="form_input">
            <tr><td class="form_title">お名前</td><td><input type="text" name="name"></td></tr>
            <tr><td class="form_title">EMAIL</td><td><input type="text" name="mail"></td></tr>
            <tr><td class="form_title">年収</td><td><input type="text" name="salary"></td></tr>
            <tr><td class="form_title">希望職種</td><td><input type="text" name="jop_type"></td></tr>
            <tr><td class="form_title">履歴書</td><td><input name="userfile" type="file"><input type="submit" value="送信"></td></tr>
        </table>
    </form>
</body>
</html> 