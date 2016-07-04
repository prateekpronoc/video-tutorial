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
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `categories`
--

/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` (`id`,`name`) VALUES 
 (1,'Categoyr1'),
 (2,'Category2'),
 (3,'Category3'),
 (4,'Category4'),
 (5,'Category 5'),
 (6,'Category 6'),
 (7,'Category 7');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;


--
-- Definition of table `course_subscription`
--

DROP TABLE IF EXISTS `course_subscription`;
CREATE TABLE `course_subscription` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `courseId` int(10) NOT NULL,
  `userId` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `course_subscription`
--

/*!40000 ALTER TABLE `course_subscription` DISABLE KEYS */;
INSERT INTO `course_subscription` (`id`,`courseId`,`userId`) VALUES 
 (1,7,8),
 (2,6,8);
/*!40000 ALTER TABLE `course_subscription` ENABLE KEYS */;


--
-- Definition of table `course_unit_lesson_r`
--

DROP TABLE IF EXISTS `course_unit_lesson_r`;
CREATE TABLE `course_unit_lesson_r` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `courseId` int(10) NOT NULL,
  `unitId` int(10) NOT NULL,
  `lessonId` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `course_unit_lesson_r`
--

/*!40000 ALTER TABLE `course_unit_lesson_r` DISABLE KEYS */;
INSERT INTO `course_unit_lesson_r` (`id`,`courseId`,`unitId`,`lessonId`) VALUES 
 (1,7,2,1),
 (2,7,2,2),
 (3,6,3,3),
 (4,11,28,4);
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
  `subscriptionFee` varchar(45) DEFAULT NULL,
  `filePath` varchar(255) DEFAULT NULL,
  `categoryId` int(10) unsigned DEFAULT NULL,
  `fileName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses`
--

/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` (`id`,`name`,`description`,`demo`,`validFrom`,`validTo`,`duration`,`color_code`,`subscriptionFee`,`filePath`,`categoryId`,`fileName`) VALUES 
 (2,'Current Affairs','National and internation news',NULL,123123,NULL,10,'#D9EDF7','100',NULL,1,NULL),
 (5,'Gk','GK','null',NULL,123123,20,'#F2DEDE','200','http://localhost:3000\\filesPath\\rOb6Kf16RmCbiCCYGatM15HF.pdf',2,'Node.js Recipes - Cory Gackenheimer.pdf'),
 (6,'History','This course will be taken by Tariq Anwar. It will be 24 hour course covering Ancient India, Modern India, World History and India Since Independence',NULL,NULL,NULL,10,'#20898C','150',NULL,0,NULL),
 (7,'Civil','Civil',NULL,NULL,NULL,30,'#F092B0','300',NULL,3,NULL),
 (11,'Economics','Economics world wide','',NULL,NULL,NULL,'#B2D3BA',NULL,'http://localhost:3000\\filesPath\\fA-TGxr-cCGIfMw8gHUcgTvF.pdf',3,'Node.js Recipes - Cory Gackenheimer.pdf');
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;


--
-- Definition of table `courses_instructor`
--

DROP TABLE IF EXISTS `courses_instructor`;
CREATE TABLE `courses_instructor` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `courseId` int(10) NOT NULL,
  `userId` int(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses_instructor`
--

/*!40000 ALTER TABLE `courses_instructor` DISABLE KEYS */;
INSERT INTO `courses_instructor` (`id`,`courseId`,`userId`) VALUES 
 (7,6,8),
 (8,6,2),
 (13,2,8),
 (14,2,7),
 (39,7,8),
 (40,8,10),
 (41,9,10),
 (42,10,10),
 (46,5,8),
 (47,5,9),
 (49,11,10);
/*!40000 ALTER TABLE `courses_instructor` ENABLE KEYS */;


--
-- Definition of table `lesson_comments`
--

DROP TABLE IF EXISTS `lesson_comments`;
CREATE TABLE `lesson_comments` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `lessonId` int(10) NOT NULL,
  `comments` varchar(100) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `userId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lesson_comments`
--

/*!40000 ALTER TABLE `lesson_comments` DISABLE KEYS */;
INSERT INTO `lesson_comments` (`id`,`lessonId`,`comments`,`timestamp`,`userId`) VALUES 
 (1,1,'qwer tyu iop','2016-06-29 17:05:41',8),
 (2,1,'asasd adasdsad asdsadsa asdasdsad','2016-06-29 17:05:41',9),
 (3,1,'fxvtfbdfbf fgb vfbgcvb gf','2016-06-29 17:05:41',8),
 (4,1,'qwere dgh hjkmj','2016-06-29 17:47:11',9),
 (5,1,'This is good','2016-06-29 17:57:19',8),
 (6,1,'Thats good','2016-06-29 18:59:13',8),
 (8,2,'sgfsdgd','2016-06-30 01:07:00',8),
 (9,1,'Just like that','2016-06-30 13:12:44',8),
 (10,1,'just for fun','2016-06-30 13:18:17',8);
/*!40000 ALTER TABLE `lesson_comments` ENABLE KEYS */;


--
-- Definition of table `lesson_files`
--

DROP TABLE IF EXISTS `lesson_files`;
CREATE TABLE `lesson_files` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `lessonId` int(10) NOT NULL,
  `filePath` varchar(100) NOT NULL,
  `fileName` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lesson_files`
--

/*!40000 ALTER TABLE `lesson_files` DISABLE KEYS */;
INSERT INTO `lesson_files` (`id`,`lessonId`,`filePath`,`fileName`) VALUES 
 (1,1,'text.txt','text.txt'),
 (2,1,'pdffile.pdf','pdffile.pdf'),
 (3,3,'text1.pdf','text1.pdf'),
 (4,2,'http://localhost:3000\\filesPath\\2Xw-5z8rIPi1XXnHDkNyFgM9.pdf','Node.js Design Patterns - Casciaro, Mario [PDF][StormRG].pdf'),
 (5,2,'http://localhost:3000\\filesPath\\SfLpxqqD-JLNAAcvnM0DJ_6x.pdf','Node.js Recipes - Cory Gackenheimer.pdf');
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lessons`
--

/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` (`id`,`name`,`description`,`video`,`air_date`,`duration`) VALUES 
 (1,'lesson1','this is the lesson 1','//www.youtube.com/embed/zpOULjyy-n8?rel=0',NULL,10),
 (2,'lesson2','This is the lesson 2','null',NULL,10),
 (3,'lesson3','This is the lesson 3',NULL,NULL,10),
 (4,'Lesson4','Lesson number 4','Video link',NULL,14);
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;


--
-- Definition of table `units`
--

DROP TABLE IF EXISTS `units`;
CREATE TABLE `units` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(100) NOT NULL,
  `courseId` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `units`
--

/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` (`id`,`name`,`description`,`courseId`) VALUES 
 (2,'Civil1','civil1',7),
 (3,'History1','history2',6),
 (11,'Civil2','Civil2',7),
 (12,'Civil3','Civil3',7),
 (18,'civil4','civil4',7),
 (28,'Eco1','Eco1',11),
 (29,'Eco2','Eco2',11);
/*!40000 ALTER TABLE `units` ENABLE KEYS */;


--
-- Definition of table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(70) NOT NULL AUTO_INCREMENT,
  `fullName` varchar(45) DEFAULT NULL,
  `joinDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `about` varchar(100) DEFAULT NULL,
  `profilePhoto` varchar(200) DEFAULT NULL,
  `billingAddress` varchar(100) DEFAULT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  `profileType` varchar(45) DEFAULT NULL,
  `password` varchar(45) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`,`fullName`,`joinDate`,`about`,`profilePhoto`,`billingAddress`,`email`,`phone`,`status`,`profileType`,`password`) VALUES 
 (8,'Udit Negi','2016-06-28 19:50:36','just fine','http://localhost:3000\\imagesPath\\vllR_RcJQ5JeoJu7iTIgSVxf.png','','negi.udit@gmail.com','9900015910','active','student','81dc9bdb52d04dc20036dbd8313ed055'),
 (9,'Admin','2016-06-28 19:51:13','fine','http://localhost:3000\\imagesPath\\m4Cf1sb1rrX4DQf94tXuZ_jL.png','','admin@gmail.com','1234567890','null','admin','81dc9bdb52d04dc20036dbd8313ed055'),
 (10,'Ayush Sinha','2016-07-01 15:33:18',NULL,NULL,NULL,'ayush.sinha@gmail.com','9874563210','active','instructor','81dc9bdb52d04dc20036dbd8313ed055'),
 (11,'Ayushman','2016-07-04 20:48:11',NULL,NULL,NULL,'ayush@forumias.com','7070700521',NULL,'student','91e01cf003a151f5694d07c70e908994'),
 (12,'dfgdfdfgdf','2016-07-04 22:08:42',NULL,NULL,NULL,'sdf@dff.vnb','5698741236',NULL,NULL,'81dc9bdb52d04dc20036dbd8313ed055'),
 (13,'sdfxfdssf','2016-07-04 22:16:28',NULL,NULL,NULL,'saads@sdf.vc','1234567896',NULL,NULL,'81dc9bdb52d04dc20036dbd8313ed055'),
 (14,'xfsdf','2016-07-04 22:17:58',NULL,NULL,NULL,'xcdf@df.gfg','1245789632',NULL,NULL,'81dc9bdb52d04dc20036dbd8313ed055');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
