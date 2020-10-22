-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- ホスト: mysql1015.db.sakura.ne.jp
-- 生成日時: 2020 年 10 月 23 日 01:48
-- サーバのバージョン： 5.7.28-log
-- PHP のバージョン: 7.1.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- データベース: `mikitsuba_memopad`
--

-- --------------------------------------------------------

--
-- テーブルの構造 `memo`
--

CREATE TABLE `memo` (
  `id` int(16) NOT NULL,
  `user_id` varchar(16) COLLATE utf8_unicode_ci NOT NULL,
  `title` varchar(64) COLLATE utf8_unicode_ci DEFAULT NULL,
  `contents` text COLLATE utf8_unicode_ci,
  `color` varchar(18) COLLATE utf8_unicode_ci NOT NULL,
  `size` varchar(10) COLLATE utf8_unicode_ci NOT NULL,
  `position` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- テーブルのデータのダンプ `memo`
--

INSERT INTO `memo` (`id`, `user_id`, `title`, `contents`, `color`, `size`, `position`) VALUES
(120, '1753c9f3a5d', '明日の予定', '- ご飯\n- プログラミング勉強\n- ランニング', 'rgb(255, 179, 221)', '200px', '{\"x\": 203, \"y\": 153}'),
(129, '1753c9f3a5d', '将来の夢', '- 超お金持ちになる\n- 世界一周旅行にいく', 'rgb(83, 163, 180)', '250px', '{\"x\": 641, \"y\": 488}'),
(130, '1753c9f3a5d', '欲しいモノ', '- macbook air\n- airpods pro studio\n- おカネ', 'rgb(255, 251, 179)', '250px', '{\"x\": 1040, \"y\": 493}'),
(133, '17550fb5862', '', '', 'rgb(255, 251, 179)', '250px', '{\"x\": 614, \"y\": 339}'),
(134, '1755103bcf6', 'メモができた', 'すごいぞ\n', 'rgb(255, 251, 179)', '250px', '{\"x\": 1393, \"y\": 135}'),
(135, '1755103bcf6', 'だいじょうぶだ', 'できた', 'rgb(255, 251, 179)', '250px', '{\"x\": 313, \"y\": 175}'),
(141, '1753c9f3a5d', 'aaaa', 'aaaaa', 'rgb(255, 251, 179)', '250px', '{\"x\": 1272, \"y\": 124}'),
(142, '1753c9f3a5d', '', '', 'rgb(255, 251, 179)', '250px', '{\"x\": 543, \"y\": 170}');

--
-- ダンプしたテーブルのインデックス
--

--
-- テーブルのインデックス `memo`
--
ALTER TABLE `memo`
  ADD PRIMARY KEY (`id`);

--
-- ダンプしたテーブルのAUTO_INCREMENT
--

--
-- テーブルのAUTO_INCREMENT `memo`
--
ALTER TABLE `memo`
  MODIFY `id` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
