# ************************************************************
# Sequel Pro SQL dump
# Version 4096
#
# http://www.sequelpro.com/
# http://code.google.com/p/sequel-pro/
#
# Host: 120.24.60.7 (MySQL 5.5.55-0ubuntu0.14.04.1)
# Database: vote-activity
# Generation Time: 2019-04-01 03:47:18 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table va_candidates
# ------------------------------------------------------------

DROP TABLE IF EXISTS `va_candidates`;

CREATE TABLE `va_candidates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL COMMENT '候选人姓名',
  `info` varchar(100) DEFAULT NULL COMMENT '候选人信息',
  `createdAt` varchar(20) DEFAULT NULL COMMENT '候选人添加时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table va_users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `va_users`;

CREATE TABLE `va_users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(50) DEFAULT '',
  `password` varchar(50) DEFAULT NULL,
  `isActive` int(3) DEFAULT NULL,
  `createdAt` varchar(15) DEFAULT NULL COMMENT '注册',
  `activedAt` varchar(15) DEFAULT NULL COMMENT '激活时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table va_votes
# ------------------------------------------------------------

DROP TABLE IF EXISTS `va_votes`;

CREATE TABLE `va_votes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `cuid` int(11) DEFAULT NULL COMMENT '候选人ID',
  `uid` int(11) DEFAULT NULL COMMENT '投票人ID',
  `createdAt` varchar(15) DEFAULT NULL COMMENT '投票时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
