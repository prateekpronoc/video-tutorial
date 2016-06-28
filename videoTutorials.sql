-- MySQL Administrator dump 1.4
--
-- ------------------------------------------------------
-- Server version	5.5.50


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


--
-- Create schema tutorialsdb
--

CREATE DATABASE IF NOT EXISTS tutorialsdb;
USE tutorialsdb;

--
-- Definition of table `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `Name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;


--
-- Definition of table `course_category_r`
--

DROP TABLE IF EXISTS `course_category_r`;
CREATE TABLE `course_category_r` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` int(10) NOT NULL,
  `category_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `course_category_r`
--

/*!40000 ALTER TABLE `course_category_r` DISABLE KEYS */;
/*!40000 ALTER TABLE `course_category_r` ENABLE KEYS */;


--
-- Definition of table `course_subscription`
--

DROP TABLE IF EXISTS `course_subscription`;
CREATE TABLE `course_subscription` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `course_subscription`
--

/*!40000 ALTER TABLE `course_subscription` DISABLE KEYS */;
INSERT INTO `course_subscription` (`id`,`course_id`,`user_id`) VALUES 
 (1,7,7);
/*!40000 ALTER TABLE `course_subscription` ENABLE KEYS */;


--
-- Definition of table `course_unit_lesson_r`
--

DROP TABLE IF EXISTS `course_unit_lesson_r`;
CREATE TABLE `course_unit_lesson_r` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` int(10) NOT NULL,
  `unit_id` int(10) NOT NULL,
  `lesson_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `course_unit_lesson_r`
--

/*!40000 ALTER TABLE `course_unit_lesson_r` DISABLE KEYS */;
INSERT INTO `course_unit_lesson_r` (`id`,`course_id`,`unit_id`,`lesson_id`) VALUES 
 (1,7,2,1),
 (2,7,2,2),
 (3,7,3,3);
/*!40000 ALTER TABLE `course_unit_lesson_r` ENABLE KEYS */;


--
-- Definition of table `courses`
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(500) NOT NULL,
  `demo` varchar(100) DEFAULT NULL,
  `validFrom` int(10) DEFAULT NULL,
  `validTo` int(10) DEFAULT NULL,
  `duration` int(10) unsigned DEFAULT NULL,
  `color_code` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses`
--

/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` (`id`,`name`,`description`,`demo`,`validFrom`,`validTo`,`duration`,`color_code`) VALUES 
 (2,'Current Affairs','National and internation news',NULL,123123,NULL,10,'#D9EDF7'),
 (5,'Gk','GK',NULL,NULL,123123,20,'#F2DEDE'),
 (6,'History','This course will be taken by Tariq Anwar. It will be 24 hour course covering Ancient India, Modern India, World History and India Since Independence',NULL,NULL,NULL,10,'#20898C'),
 (7,'Civil','Civil',NULL,NULL,NULL,30,'#F092B0');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;


--
-- Definition of table `courses_instructor`
--

DROP TABLE IF EXISTS `courses_instructor`;
CREATE TABLE `courses_instructor` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `course_id` int(10) NOT NULL,
  `user_id` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses_instructor`
--

/*!40000 ALTER TABLE `courses_instructor` DISABLE KEYS */;
INSERT INTO `courses_instructor` (`id`,`course_id`,`user_id`) VALUES 
 (5,5,7),
 (6,5,9),
 (7,6,7),
 (8,6,2),
 (13,2,3),
 (14,2,7),
 (15,7,3),
 (16,7,4);
/*!40000 ALTER TABLE `courses_instructor` ENABLE KEYS */;


--
-- Definition of table `lesson_commints`
--

DROP TABLE IF EXISTS `lesson_commints`;
CREATE TABLE `lesson_commints` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `lesson_id` int(10) NOT NULL,
  `commints` varchar(100) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lesson_commints`
--

/*!40000 ALTER TABLE `lesson_commints` DISABLE KEYS */;
/*!40000 ALTER TABLE `lesson_commints` ENABLE KEYS */;


--
-- Definition of table `lesson_files`
--

DROP TABLE IF EXISTS `lesson_files`;
CREATE TABLE `lesson_files` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `lesson_id` int(10) NOT NULL,
  `file` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lesson_files`
--

/*!40000 ALTER TABLE `lesson_files` DISABLE KEYS */;
/*!40000 ALTER TABLE `lesson_files` ENABLE KEYS */;


--
-- Definition of table `lessons`
--

DROP TABLE IF EXISTS `lessons`;
CREATE TABLE `lessons` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(100) NOT NULL,
  `video` varchar(100) DEFAULT NULL,
  `air_date` int(10) DEFAULT NULL,
  `duration` int(100) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lessons`
--

/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` (`id`,`name`,`description`,`video`,`air_date`,`duration`) VALUES 
 (1,'lesson1','this is the lesson 1','//www.youtube.com/embed/zpOULjyy-n8?rel=0',NULL,10),
 (2,'lesson2','This is the lesson 2',NULL,NULL,10),
 (3,'lesson3','This is the lesson 3',NULL,NULL,10);
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;


--
-- Definition of table `units`
--

DROP TABLE IF EXISTS `units`;
CREATE TABLE `units` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `units`
--

/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` (`id`,`name`,`description`) VALUES 
 (2,'Civil1','civil1'),
 (3,'History1','history2');
/*!40000 ALTER TABLE `units` ENABLE KEYS */;


--
-- Definition of table `user_info`
--

DROP TABLE IF EXISTS `user_info`;
CREATE TABLE `user_info` (
  `id` int(70) NOT NULL AUTO_INCREMENT,
  `userId` int(70) NOT NULL,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) DEFAULT NULL,
  `joinDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `about` varchar(100) DEFAULT NULL,
  `profilePhoto` varchar(45) DEFAULT NULL,
  `billingAddress` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_info`
--

/*!40000 ALTER TABLE `user_info` DISABLE KEYS */;
INSERT INTO `user_info` (`id`,`userId`,`firstName`,`lastName`,`joinDate`,`about`,`profilePhoto`,`billingAddress`) VALUES 
 (6,7,'Udit','Negi','2016-06-25 16:23:51','I am fine.',NULL,NULL),
 (7,9,'admin','admin','2016-06-26 19:37:29',NULL,NULL,NULL);
/*!40000 ALTER TABLE `user_info` ENABLE KEYS */;


--
-- Definition of table `user_login`
--

DROP TABLE IF EXISTS `user_login`;
CREATE TABLE `user_login` (
  `id` int(70) NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `password` varchar(100) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  `profileType` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `user_email_UNIQUE` (`email`) USING BTREE,
  UNIQUE KEY `user_phone_UNIQUE` (`phone`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user_login`
--

/*!40000 ALTER TABLE `user_login` DISABLE KEYS */;
INSERT INTO `user_login` (`id`,`email`,`phone`,`password`,`status`,`profileType`) VALUES 
 (7,'negi.udit@gmail.com','9900015910','81dc9bdb52d04dc20036dbd8313ed055',NULL,'student'),
 (9,'admin@gmail.com','1234567890','81dc9bdb52d04dc20036dbd8313ed055',NULL,'admin');
/*!40000 ALTER TABLE `user_login` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
