-- phpMyAdmin SQL Dump
-- version 4.9.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 22, 2020 at 01:41 PM
-- Server version: 5.7.26
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `memopad`
--

-- --------------------------------------------------------

--
-- Table structure for table `memo`
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
-- Dumping data for table `memo`
--

INSERT INTO `memo` (`id`, `user_id`, `title`, `contents`, `color`, `size`, `position`) VALUES
(120, '1753c9f3a5d', '明日の予定', '- ご飯\n- プログラミング勉強\n- ランニング', 'rgb(255, 179, 221)', '200px', '{\"x\": 275, \"y\": 264}'),
(129, '1753c9f3a5d', '将来の夢', '- 超お金持ちになる\n- 世界一周旅行にいく', 'rgb(83, 163, 180)', '250px', '{\"x\": 719, \"y\": 367}'),
(130, '1753c9f3a5d', '欲しいモノ', '- macbook air\n- airpods pro studio\n- おカネ', 'rgb(255, 251, 179)', '250px', '{\"x\": 1260, \"y\": 263}');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `memo`
--
ALTER TABLE `memo`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `memo`
--
ALTER TABLE `memo`
  MODIFY `id` int(16) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=131;