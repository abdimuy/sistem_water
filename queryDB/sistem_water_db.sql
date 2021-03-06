-- MySQL dump 10.13  Distrib 8.0.26, for Win64 (x86_64)
--
-- Host: localhost    Database: sistem_water
-- ------------------------------------------------------
-- Server version	8.0.26

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `client_level`
--

DROP TABLE IF EXISTS `client_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `client_level` (
  `id` int NOT NULL AUTO_INCREMENT,
  `clientLevel` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `client_level`
--

LOCK TABLES `client_level` WRITE;
/*!40000 ALTER TABLE `client_level` DISABLE KEYS */;
INSERT INTO `client_level` VALUES (1,'Titular'),(2,'Hidrante');
/*!40000 ALTER TABLE `client_level` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clients`
--

DROP TABLE IF EXISTS `clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `disabled` tinyint NOT NULL DEFAULT '0',
  `idTypeClient` int NOT NULL,
  `delete` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_idTypeClient_idx` (`idTypeClient`),
  CONSTRAINT `fk_idTypeClients` FOREIGN KEY (`idTypeClient`) REFERENCES `type_clients` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clients`
--

LOCK TABLES `clients` WRITE;
/*!40000 ALTER TABLE `clients` DISABLE KEYS */;
INSERT INTO `clients` VALUES (1,'Aldrich ','Cortero Gonzalez',1,2,0),(2,'Abdiel','Gonzalez',0,2,0),(3,'Jose','Perez',1,1,0),(31,'Jose alberto','Perez',0,1,0),(32,'Nombre ejemplo','Apellido Ejemplo',0,1,0),(33,'Nombre ejemplo','Apellido Ejemplo',0,1,0),(34,'Nombre ejemplo','Apellido Ejemplo',0,1,0);
/*!40000 ALTER TABLE `clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colonias`
--

DROP TABLE IF EXISTS `colonias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colonias` (
  `id` int NOT NULL,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colonias`
--

LOCK TABLES `colonias` WRITE;
/*!40000 ALTER TABLE `colonias` DISABLE KEYS */;
INSERT INTO `colonias` VALUES (1,'San Pedro Acoquiaco'),(2,'Colonia ejemplo');
/*!40000 ALTER TABLE `colonias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `income_and_expenses`
--

DROP TABLE IF EXISTS `income_and_expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `income_and_expenses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` int NOT NULL,
  `idClient` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `income_and_expenses`
--

LOCK TABLES `income_and_expenses` WRITE;
/*!40000 ALTER TABLE `income_and_expenses` DISABLE KEYS */;
INSERT INTO `income_and_expenses` VALUES (1,30,1);
/*!40000 ALTER TABLE `income_and_expenses` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prices`
--

DROP TABLE IF EXISTS `prices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` int NOT NULL,
  `dateInit` date NOT NULL,
  `dateFinish` date DEFAULT NULL,
  `idTypeClient` int DEFAULT NULL,
  `idTypePrice` int NOT NULL,
  `latePrice` int NOT NULL,
  `priceConnection` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `fk_idTypeClient_idx` (`idTypeClient`),
  CONSTRAINT `fk_idTypeClient` FOREIGN KEY (`idTypeClient`) REFERENCES `type_clients` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prices`
--

LOCK TABLES `prices` WRITE;
/*!40000 ALTER TABLE `prices` DISABLE KEYS */;
INSERT INTO `prices` VALUES (1,30,'2010-01-01','2021-02-28',1,1,40,1000),(2,50,'2021-03-01','2100-01-01',1,1,60,2000),(3,15,'2010-01-01','2020-12-31',2,1,20,100),(4,20,'2021-01-01','2100-01-01',2,1,25,200);
/*!40000 ALTER TABLE `prices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idTypeReport` int NOT NULL,
  `note` varchar(200) DEFAULT NULL,
  `idTimeConnection` int DEFAULT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_idTimeConnection_idx` (`idTimeConnection`),
  KEY `fk_idTypeReport_idx` (`idTypeReport`),
  CONSTRAINT `fk_idTimeConnection` FOREIGN KEY (`idTimeConnection`) REFERENCES `time_connection` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_idTypeReport` FOREIGN KEY (`idTypeReport`) REFERENCES `type_reports` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES (1,1,'Nota de prueba',1,'0000-00-00 00:00:00'),(2,1,'Reporte 2',6,'0000-00-00 00:00:00'),(5,1,'No de reporte de ejemplo',1,'2021-10-10 00:00:00'),(10,1,'No de reporte de ejemplo',1,'2021-10-10 00:00:00'),(30,1,'No de reporte de ejemplo',1,'2021-10-10 00:00:00'),(31,1,'No de reporte de ejemplo',2,'2021-10-10 00:00:00'),(32,1,NULL,6,'2021-10-10 00:00:00'),(35,1,NULL,6,'2021-10-10 00:00:00'),(36,1,NULL,6,'2021-10-10 00:00:00'),(37,1,NULL,6,'2021-10-10 00:00:00'),(38,1,NULL,6,'2021-10-10 00:00:00');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `time_connection`
--

DROP TABLE IF EXISTS `time_connection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `time_connection` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idWaterConnection` int NOT NULL,
  `idClient` int NOT NULL,
  `dateInitPayment` date DEFAULT NULL,
  `active` tinyint NOT NULL,
  `dateFinishPayment` date DEFAULT NULL,
  `delete` tinyint DEFAULT '0',
  `dateStartPayment` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_idClient_idx` (`idClient`),
  KEY `fk_idWaterConnection_idx` (`idWaterConnection`),
  CONSTRAINT `fk_idClient` FOREIGN KEY (`idClient`) REFERENCES `clients` (`id`),
  CONSTRAINT `fk_idWaterConnectionOfTime` FOREIGN KEY (`idWaterConnection`) REFERENCES `water_connection` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `time_connection`
--

LOCK TABLES `time_connection` WRITE;
/*!40000 ALTER TABLE `time_connection` DISABLE KEYS */;
INSERT INTO `time_connection` VALUES (1,1,1,'2021-01-01',1,'2021-10-25',0,'2020-01-01'),(2,2,1,'2018-01-01',0,'2019-12-31',0,NULL),(6,40,31,'2021-01-01',1,NULL,0,'2021-01-01'),(7,42,32,'2020-01-01',1,NULL,0,'2020-01-01'),(8,43,33,'2020-01-01',1,NULL,0,'2020-01-01'),(9,44,34,'2020-01-01',1,NULL,0,'2020-01-01');
/*!40000 ALTER TABLE `time_connection` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transaction`
--

DROP TABLE IF EXISTS `transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` int NOT NULL,
  `date` datetime NOT NULL,
  `note` varchar(200) DEFAULT NULL,
  `idTypeTransaction` int NOT NULL,
  `dateCreate` datetime NOT NULL,
  `idReport` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_idReport_idx` (`idReport`),
  KEY `fk_idTypeTransaction_idx` (`idTypeTransaction`),
  CONSTRAINT `fk_idReport` FOREIGN KEY (`idReport`) REFERENCES `reports` (`id`),
  CONSTRAINT `fk_idTypeTransaction` FOREIGN KEY (`idTypeTransaction`) REFERENCES `type_transaction` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=35 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transaction`
--

LOCK TABLES `transaction` WRITE;
/*!40000 ALTER TABLE `transaction` DISABLE KEYS */;
INSERT INTO `transaction` VALUES (1,100,'2010-10-10 00:00:00','Pago agregado el dia de hoy',1,'2011-10-10 00:00:00',1),(27,300,'2021-01-20 00:00:00','texto de ejemplo 2',1,'2021-11-11 00:00:00',32),(28,200,'2021-02-12 00:00:00',NULL,1,'2021-10-10 00:00:00',35),(29,300,'2021-03-19 00:00:00','texto de ejemplo 2',1,'2021-11-11 00:00:00',35),(30,150,'2021-04-06 00:00:00',NULL,1,'2021-10-10 00:00:00',36),(32,200,'2021-05-05 00:00:00',NULL,1,'2021-10-10 00:00:00',38),(33,300,'2021-06-06 00:00:00','texto de ejemplo 2',1,'2021-11-11 00:00:00',38),(34,300,'2021-07-07 00:00:00','texto de ejemplo 2',1,'2021-11-11 00:00:00',38);
/*!40000 ALTER TABLE `transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_clients`
--

DROP TABLE IF EXISTS `type_clients`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `idClientLevel` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_idLevelClient_idx` (`idClientLevel`),
  CONSTRAINT `fk_idLevelClient` FOREIGN KEY (`idClientLevel`) REFERENCES `client_level` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_clients`
--

LOCK TABLES `type_clients` WRITE;
/*!40000 ALTER TABLE `type_clients` DISABLE KEYS */;
INSERT INTO `type_clients` VALUES (1,'Casa comun',1),(2,'Hidrante',2);
/*!40000 ALTER TABLE `type_clients` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_income_or_expense`
--

DROP TABLE IF EXISTS `type_income_or_expense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_income_or_expense` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_income_or_expense`
--

LOCK TABLES `type_income_or_expense` WRITE;
/*!40000 ALTER TABLE `type_income_or_expense` DISABLE KEYS */;
INSERT INTO `type_income_or_expense` VALUES (1,'income'),(2,'expense');
/*!40000 ALTER TABLE `type_income_or_expense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_reports`
--

DROP TABLE IF EXISTS `type_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_reports`
--

LOCK TABLES `type_reports` WRITE;
/*!40000 ALTER TABLE `type_reports` DISABLE KEYS */;
INSERT INTO `type_reports` VALUES (1,'Pago de agua');
/*!40000 ALTER TABLE `type_reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `type_transaction`
--

DROP TABLE IF EXISTS `type_transaction`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `type_transaction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `description` varchar(400) DEFAULT NULL,
  `idTypeIncomeOrExpense` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `type_transaction`
--

LOCK TABLES `type_transaction` WRITE;
/*!40000 ALTER TABLE `type_transaction` DISABLE KEYS */;
INSERT INTO `type_transaction` VALUES (1,'Pago mensual',NULL,1),(2,'Pago de conexi├│n',NULL,2);
/*!40000 ALTER TABLE `type_transaction` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `lastName` varchar(60) NOT NULL,
  `password` varchar(100) NOT NULL,
  `nameUser` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Aldrich','Cortero','abdidev',''),(3,'Aldrich','Cortero','$2a$10$7xJ.6wFovyoMaPoFTRHCJuPqn4PQXlJvWsC9A1lABw5qVWeQGaG5O','abdidev'),(4,'Jos├®','Fernand├®z','$2a$10$e5zTeCidC7CMC6zEpaOrTeR3k1fKB0G1nhmjn91B5uaIKjc1klvkm','josesito'),(5,'Ejemplo','Apellido','$2a$10$RUadt5lNoG5VK1hRi5TC8ujt1WfYBNn0ksRVggdlowPKxsIk0wNSi','user'),(6,'ejemplo 2','Apellido 2','$2a$10$.uvL0EbP.mLmuiTo5WuPDuWjIc4mH8DzxEcr.X6muGBs2Iotd6C9a','Usuario2'),(7,'nombre','ejemplo','$2a$10$h4zc3sGvzQDrWqlTfMmLhuZCi4B0mahqecjAqwL4z8NBaTAsFjct6','nuevouser'),(8,'Aldrich','Gonzalez','$2a$10$gH786lDo5d1R5RpbIPI1TuQInUfjyU8PZ2w.F.3n48.CfXGHSoAJS','Aldrich Abdiel Cortero Gonzalez'),(9,'Aldrich','Gonzalez','$2a$10$lGH0ZHM/9N0zPFbsPFRs3usZoCFHqv7gG0cuuzfvTrFjF/SSXlYgi','Abdi1'),(10,'Administrador','Administrador','$2a$10$5PcxllIsXrutlS2YyJ.jMeUjdpnxQ52Byb/7VpXpy.xVFS4xgp1Ci','admin');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `water_connection`
--

DROP TABLE IF EXISTS `water_connection`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `water_connection` (
  `id` int NOT NULL AUTO_INCREMENT,
  `street` varchar(60) NOT NULL,
  `houseNumber` varchar(30) DEFAULT NULL,
  `idColonia` int NOT NULL,
  `reference` varchar(60) DEFAULT NULL,
  `dateConnection` datetime NOT NULL,
  `delete` tinyint NOT NULL DEFAULT '0',
  `numberConnection` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_idColonia_idx` (`idColonia`),
  CONSTRAINT `fk_idColonia` FOREIGN KEY (`idColonia`) REFERENCES `colonias` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `water_connection`
--

LOCK TABLES `water_connection` WRITE;
/*!40000 ALTER TABLE `water_connection` DISABLE KEYS */;
INSERT INTO `water_connection` VALUES (1,'calle 12','256',1,'Casa naranja','2014-10-25 20:00:00',0,4),(2,'Vicente Guerro','12',1,'Casa de color azul','2020-10-25 20:00:00',0,5),(40,'calle ejemplo','12',2,'Casa de color morado','2015-01-01 00:00:00',0,1),(42,'calle ejemplo 3','12',1,'Casa de color ejemplo','2015-01-01 00:00:00',0,6),(43,'calle ejemplo 4','12',1,'Casa de color ejemplo','2015-01-01 00:00:00',0,7),(44,'calle ejemplo 5','12',2,'Casa de color ejemplo','2015-01-01 00:00:00',0,2);
/*!40000 ALTER TABLE `water_connection` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-08 11:52:22
