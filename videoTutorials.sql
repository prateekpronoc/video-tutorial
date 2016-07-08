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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

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
  `demoVideo` varchar(100) DEFAULT NULL,
  `validFrom` int(10) DEFAULT NULL,
  `validTo` int(10) DEFAULT NULL,
  `duration` int(10) unsigned DEFAULT NULL,
  `color_code` varchar(45) DEFAULT NULL,
  `subscriptionFee` varchar(45) DEFAULT NULL,
  `filePath` varchar(255) DEFAULT NULL,
  `categoryId` int(10) unsigned DEFAULT NULL,
  `fileName` varchar(45) DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  `demoPoster` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses`
--

/*!40000 ALTER TABLE `courses` DISABLE KEYS */;
INSERT INTO `courses` (`id`,`name`,`description`,`demoVideo`,`validFrom`,`validTo`,`duration`,`color_code`,`subscriptionFee`,`filePath`,`categoryId`,`fileName`,`isDeleted`,`demoPoster`) VALUES 
 (2,'Current Affairs','National and internation news','http://d38mgtvgmsvii9.cloudfront.net/rising/2MayCurrAff/2MayCurrAff.m3u8',123123,NULL,10,'#D9EDF7','100','null',1,'null',0,'https://s3-ap-southeast-1.amazonaws.com/flavido-encodes/rising/2nd+May.jpg'),
 (5,'Gk','GK','http://d38mgtvgmsvii9.cloudfront.net/rising/3MayCurrAff/3MayCurrAff.m3u8',NULL,123123,20,'#F2DEDE','200','http://localhost:3000\\filesPath\\rOb6Kf16RmCbiCCYGatM15HF.pdf',2,'Node.js Recipes - Cory Gackenheimer.pdf',0,'https://s3-ap-southeast-1.amazonaws.com/flavido-encodes/rising/3rd+May.jpg'),
 (6,'History','This course will be taken by Tariq Anwar. It will be 24 hour course covering Ancient India, Modern India, World History and India Since Independence','http://d38mgtvgmsvii9.cloudfront.net/rising/4JulyRisingCurrAff-Rev1/4JulyRisingCurrAff-Rev1.m3u8',NULL,NULL,10,'#20898C','150','null',0,'null',0,'http://i.imgur.com/t1nI8bJ.jpg'),
 (7,'Civil','Civil','//www.youtube.com/v/ylLzyHk54Z0',NULL,NULL,30,'#F092B0','300',NULL,3,NULL,0,NULL),
 (11,'Economics','Economics world wide','',NULL,NULL,NULL,'#B2D3BA',NULL,'http://localhost:3000\\filesPath\\fA-TGxr-cCGIfMw8gHUcgTvF.pdf',3,'Node.js Recipes - Cory Gackenheimer.pdf',0,NULL);
/*!40000 ALTER TABLE `courses` ENABLE KEYS */;


--
-- Definition of table `courses_instructor`
--

DROP TABLE IF EXISTS `courses_instructor`;
CREATE TABLE `courses_instructor` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `courseId` int(10) NOT NULL,
  `userId` int(10) NOT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_index` (`userId`,`courseId`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `courses_instructor`
--

/*!40000 ALTER TABLE `courses_instructor` DISABLE KEYS */;
INSERT INTO `courses_instructor` (`id`,`courseId`,`userId`,`isDeleted`) VALUES 
 (13,2,8,0),
 (14,2,7,0),
 (39,7,8,0),
 (40,8,10,0),
 (41,9,10,0),
 (42,10,10,0),
 (49,11,10,0),
 (65,5,10,0);
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
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lesson_comments`
--

/*!40000 ALTER TABLE `lesson_comments` DISABLE KEYS */;
INSERT INTO `lesson_comments` (`id`,`lessonId`,`comments`,`timestamp`,`userId`,`isDeleted`) VALUES 
 (1,1,'qwer tyu iop','2016-06-29 17:05:41',8,0),
 (2,1,'asasd adasdsad asdsadsa asdasdsad','2016-06-29 17:05:41',9,0),
 (3,1,'fxvtfbdfbf fgb vfbgcvb gf','2016-06-29 17:05:41',8,0),
 (4,1,'qwere dgh hjkmj','2016-06-29 17:47:11',9,0),
 (5,1,'This is good','2016-06-29 17:57:19',8,0),
 (6,1,'Thats good','2016-06-29 18:59:13',8,0),
 (8,2,'sgfsdgd','2016-06-30 01:07:00',8,0),
 (9,1,'Just like that','2016-06-30 13:12:44',8,0),
 (10,1,'just for fun','2016-06-30 13:18:17',8,0),
 (11,1,'its fun','2016-07-05 14:53:42',9,0);
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
  `isDeleted` tinyint(1) DEFAULT '0',
  `poster` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `lessons`
--

/*!40000 ALTER TABLE `lessons` DISABLE KEYS */;
INSERT INTO `lessons` (`id`,`name`,`description`,`video`,`air_date`,`duration`,`isDeleted`,`poster`) VALUES 
 (1,'lesson1','this is the lesson 1','http://d38mgtvgmsvii9.cloudfront.net/rising/4JulyRisingCurrAff-Rev1/4JulyRisingCurrAff-Rev1.m3u8',NULL,10,0,'http://i.imgur.com/t1nI8bJ.jpg'),
 (2,'lesson2','This is the lesson 2','//www.youtube.com/v/ylLzyHk54Z0',NULL,10,0,'https://s3-ap-southeast-1.amazonaws.com/flavido-encodes/rising/2nd+May.jpg'),
 (3,'lesson3','This is the lesson 3',NULL,NULL,10,0,NULL),
 (4,'Lesson4','Lesson number 4','Video link',NULL,14,0,NULL);
/*!40000 ALTER TABLE `lessons` ENABLE KEYS */;


--
-- Definition of table `payment_details`
--

DROP TABLE IF EXISTS `payment_details`;
CREATE TABLE `payment_details` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `payment_request_id` varchar(200) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `purpose` varchar(100) DEFAULT NULL,
  `amount` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fullName` varchar(100) DEFAULT NULL,
  `userId` varchar(100) DEFAULT NULL,
  `courseId` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `payment_details`
--

/*!40000 ALTER TABLE `payment_details` DISABLE KEYS */;
INSERT INTO `payment_details` (`id`,`payment_request_id`,`phone`,`purpose`,`amount`,`email`,`fullName`,`userId`,`courseId`) VALUES 
 (7,'fcae0d9e73c44b1d9af333b2ae01f380','9900015910','Subscription: Udit Negi for Gk','200','negi.udit@gmail.com','Udit Negi','8','5'),
 (8,'365ff08b333b47178bc7936aab0ebf7b','9900015910','Subscription: Udit Negi for Gk','200','negi.udit@gmail.com','Udit Negi','8','5'),
 (9,'06e6a62653bc4471bb88e59e2833ff5e','9900015910','Subscription: Udit Negi for Gk','200','negi.udit@gmail.com','Udit Negi','8','5'),
 (10,'d846952c8c9142e0bca812feeab40528','9900015910','Subscription: Udit Negi for Gk','200','negi.udit@gmail.com','Udit Negi','8','5');
/*!40000 ALTER TABLE `payment_details` ENABLE KEYS */;


--
-- Definition of table `payment_log`
--

DROP TABLE IF EXISTS `payment_log`;
CREATE TABLE `payment_log` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `payment_request_id` varchar(200) DEFAULT NULL,
  `payment_id` varchar(200) DEFAULT NULL,
  `fees` varchar(100) DEFAULT NULL,
  `mac` varchar(100) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `payment_log`
--

/*!40000 ALTER TABLE `payment_log` DISABLE KEYS */;
INSERT INTO `payment_log` (`id`,`payment_request_id`,`payment_id`,`fees`,`mac`,`status`) VALUES 
 (6,'fcae0d9e73c44b1d9af333b2ae01f380',NULL,NULL,NULL,'Pending'),
 (8,'8b6080c3e97149d684f2d7cf05792313','MOJO5369558911814992','3.80','800b13088cb9704fe55d8cec77ef9615097526f1','Credit'),
 (9,'b0da0313f418443a9b01d7c9cf3b957c','MOJO2391764479175223','3.80','0d3f1e7920f973160b572a80279cb73cc2ed9ddb','Credit'),
 (10,'365ff08b333b47178bc7936aab0ebf7b',NULL,NULL,NULL,'Pending'),
 (11,'06e6a62653bc4471bb88e59e2833ff5e',NULL,NULL,NULL,'Pending'),
 (12,'d846952c8c9142e0bca812feeab40528',NULL,NULL,NULL,'Pending');
/*!40000 ALTER TABLE `payment_log` ENABLE KEYS */;


--
-- Definition of table `units`
--

DROP TABLE IF EXISTS `units`;
CREATE TABLE `units` (
  `id` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `description` varchar(100) NOT NULL,
  `courseId` int(10) unsigned NOT NULL,
  `isDeleted` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `units`
--

/*!40000 ALTER TABLE `units` DISABLE KEYS */;
INSERT INTO `units` (`id`,`name`,`description`,`courseId`,`isDeleted`) VALUES 
 (2,'Civil1','civil1',7,0),
 (3,'History1','history2',6,1),
 (11,'Civil2','Civil2',7,0),
 (12,'Civil3','Civil3',7,0),
 (18,'civil4','civil4',7,0),
 (28,'Eco1','Eco1',11,0),
 (29,'Eco2','Eco2',11,0);
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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=latin1;

--
-- Dumping data for table `user`
--

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` (`id`,`fullName`,`joinDate`,`about`,`profilePhoto`,`billingAddress`,`email`,`phone`,`status`,`profileType`,`password`) VALUES 
 (8,'Udit Negi','2016-06-28 19:50:36','just fine','http://localhost:3000\\imagesPath\\vllR_RcJQ5JeoJu7iTIgSVxf.png','','negi.udit@gmail.com','9900015910','active','student','81dc9bdb52d04dc20036dbd8313ed055'),
 (9,'Admin','2016-06-28 19:51:13','fine','http://localhost:3000\\imagesPath\\m4Cf1sb1rrX4DQf94tXuZ_jL.png','','admin@gmail.com','1234567890','null','admin','81dc9bdb52d04dc20036dbd8313ed055'),
 (10,'Ayush Sinha','2016-07-01 15:33:18',NULL,NULL,NULL,'ayush.sinha@gmail.com','9874563210','active','instructor','81dc9bdb52d04dc20036dbd8313ed055'),
 (11,'Ayushman','2016-07-04 20:48:11',NULL,NULL,NULL,'ayush@forumias.com','7070700521',NULL,'student','91e01cf003a151f5694d07c70e908994');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;




/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
