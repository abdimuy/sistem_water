CREATE DATABASE IF NOT EXISTS sistem_water;

CREATE TABLE IF NOT EXISTS `sistem_water`.`clients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `lastName` VARCHAR(45) NOT NULL,
  `disabled` TINYINT NOT NULL,
  `idTypeClient` INT NOT NULL,
  `idWaterConnection` INT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE IF NOT EXISTS `sistem_water`.`water_connection` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `street` VARCHAR(60) NOT NULL,
  `houseNumber` VARCHAR(30),
  `colonia` VARCHAR(60) NOT NULL,
  `reference` VARCHAR(60),
  `dateConnection` DATETIME NOT NULL,
  `dateInitPayment` DATETIME NOT NULL,
  `idClient` INT,
  PRIMARY KEY (`id`));

ALTER TABLE `sistem_water`.`water_connection` 
ADD INDEX `fk_id_client_idx` (`idClient` ASC) VISIBLE;
;
ALTER TABLE `sistem_water`.`water_connection` 
ADD CONSTRAINT `fk_id_client`
  FOREIGN KEY (`idClient`)
  REFERENCES `sistem_water`.`water_connection` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `sistem_water`.`clients` 
ADD INDEX `fk_idWaterConnection_idx` (`idWaterConnection` ASC) VISIBLE;
;
ALTER TABLE `sistem_water`.`clients` 
ADD CONSTRAINT `fk_idWaterConnection`
  FOREIGN KEY (`idWaterConnection`)
  REFERENCES `sistem_water`.`clients` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE TABLE `sistem_water`.`type_clients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `idClientLevel` INT NOT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `sistem_water`.`type_clients` 
ADD INDEX `fk_idClientLevel_idx` (`idClientLevel` ASC) VISIBLE;
;
ALTER TABLE `sistem_water`.`type_clients` 
ADD CONSTRAINT `fk_idClientLevel`
  FOREIGN KEY (`idClientLevel`)
  REFERENCES `sistem_water`.`type_clients` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE TABLE `sistem_water`.`prices` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `price` INT NOT NULL,
  `dateInit` DATETIME NOT NULL,
  `dateFinish` DATETIME NOT NULL,
  `idTypeClient` INT NULL,
  `idTypePrice` INT NOT NULL,
  PRIMARY KEY (`id`));

ALTER TABLE `sistem_water`.`prices` 
ADD INDEX `fk_idTypeClient_idx` (`idTypePrice` ASC) VISIBLE;
;
ALTER TABLE `sistem_water`.`prices` 
ADD CONSTRAINT `fk_idTypeClient`
  FOREIGN KEY (`idTypePrice`)
  REFERENCES `sistem_water`.`prices` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

CREATE TABLE `sistem_water`.`income_and_expenses` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `price` INT NOT NULL,
  `idClient` INT NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `sistem_water`.`client_level` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `clientLevel` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `sistem_water`.`transaction` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `amount` INT NOT NULL,
  `date` DATETIME NOT NULL,
  `dateAdded` DATETIME NOT NULL,
  `note` VARCHAR(200) NULL,
  `idUser` INT NULL,
  `idWaterConnection` INT NULL,
  `idTypeTransaction` INT NOT NULL,
  `idClient` INT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `sistem_water`.`users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `lastName` VARCHAR(60) NOT NULL,
  `email` VARCHAR(80) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`));

CREATE TABLE `sistem_water`.`type_transaction` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(60) NOT NULL,
  `description` VARCHAR(400) NULL,
  `idTypeIncomeOrExpense` INT NOT NULL,
  PRIMARY KEY (`id`));