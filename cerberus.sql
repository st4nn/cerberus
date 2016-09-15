SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL';

CREATE SCHEMA IF NOT EXISTS `cerberus` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `cerberus` ;

-- -----------------------------------------------------
-- Table `cerberus`.`perfiles`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`perfiles` (
  `idPerfil` INT NOT NULL AUTO_INCREMENT ,
  `Nombre` VARCHAR(45) NOT NULL ,
  `Descripcion` VARCHAR(255) NULL ,
  PRIMARY KEY (`idPerfil`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`login`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`login` (
  `idLogin` INT NOT NULL AUTO_INCREMENT ,
  `usuario` VARCHAR(60) NOT NULL ,
  `clave` VARCHAR(45) NOT NULL ,
  `estado` VARCHAR(45) NULL DEFAULT 'Activo' ,
  `idPerfil` INT NOT NULL ,
  PRIMARY KEY (`idLogin`) ,
  UNIQUE INDEX `usuario_UNIQUE` (`usuario` ASC) ,
  INDEX `fk_login_perfiles1_idx` (`idPerfil` ASC) ,
  CONSTRAINT `fk_login_perfiles1`
    FOREIGN KEY (`idPerfil` )
    REFERENCES `cerberus`.`perfiles` (`idPerfil` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`datosusuarios`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`datosusuarios` (
  `idLogin` INT NOT NULL ,
  `Nombre` VARCHAR(120) NULL ,
  `correo` VARCHAR(60) NOT NULL ,
  `imagen` VARCHAR(120) NULL ,
  PRIMARY KEY (`idLogin`) ,
  CONSTRAINT `fk_datosusuarios_login`
    FOREIGN KEY (`idLogin` )
    REFERENCES `cerberus`.`login` (`idLogin` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`funciones`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`funciones` (
  `idFuncion` INT NOT NULL AUTO_INCREMENT ,
  `Nombre` VARCHAR(80) NOT NULL ,
  PRIMARY KEY (`idFuncion`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`funciones_has_perfiles`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`funciones_has_perfiles` (
  `idFuncion` INT NOT NULL ,
  `idPerfil` INT NOT NULL ,
  PRIMARY KEY (`idFuncion`, `idPerfil`) ,
  INDEX `fk_funciones_has_perfiles_perfiles1_idx` (`idPerfil` ASC) ,
  INDEX `fk_funciones_has_perfiles_funciones1_idx` (`idFuncion` ASC) ,
  CONSTRAINT `fk_funciones_has_perfiles_funciones1`
    FOREIGN KEY (`idFuncion` )
    REFERENCES `cerberus`.`funciones` (`idFuncion` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_funciones_has_perfiles_perfiles1`
    FOREIGN KEY (`idPerfil` )
    REFERENCES `cerberus`.`perfiles` (`idPerfil` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`tipoevento`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`tipoevento` (
  `idTipoEvento` INT NOT NULL AUTO_INCREMENT ,
  `Nombre` VARCHAR(60) NOT NULL ,
  PRIMARY KEY (`idTipoEvento`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`eventos`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`eventos` (
  `idEvento` INT NOT NULL AUTO_INCREMENT ,
  `Nombre` VARCHAR(120) NOT NULL ,
  `Descripcion` LONGTEXT NULL ,
  `fechaIni` DATETIME NOT NULL ,
  `fechaFin` DATETIME NOT NULL ,
  `idTipoEvento` INT NOT NULL ,
  PRIMARY KEY (`idEvento`) ,
  INDEX `fk_eventos_tipoevento1_idx` (`idTipoEvento` ASC) ,
  CONSTRAINT `fk_eventos_tipoevento1`
    FOREIGN KEY (`idTipoEvento` )
    REFERENCES `cerberus`.`tipoevento` (`idTipoEvento` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`login_has_eventos`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`login_has_eventos` (
  `idLogin` INT NOT NULL ,
  `idEvento` INT NOT NULL ,
  PRIMARY KEY (`idLogin`, `idEvento`) ,
  INDEX `fk_login_has_eventos_eventos1_idx` (`idEvento` ASC) ,
  INDEX `fk_login_has_eventos_login1_idx` (`idLogin` ASC) ,
  CONSTRAINT `fk_login_has_eventos_login1`
    FOREIGN KEY (`idLogin` )
    REFERENCES `cerberus`.`login` (`idLogin` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_login_has_eventos_eventos1`
    FOREIGN KEY (`idEvento` )
    REFERENCES `cerberus`.`eventos` (`idEvento` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`servicios`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`servicios` (
  `idServicio` INT NOT NULL AUTO_INCREMENT ,
  `Nombre` VARCHAR(45) NOT NULL ,
  `Descripcion` VARCHAR(255) NULL ,
  PRIMARY KEY (`idServicio`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`delegaciones`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`delegaciones` (
  `idDelegacion` INT NOT NULL AUTO_INCREMENT ,
  `Nombre` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`idDelegacion`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`estadosEvento`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`estadosEvento` (
  `idestadoEvento` INT NOT NULL AUTO_INCREMENT ,
  `idTipoEvento` INT NOT NULL ,
  `Nombre` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`idestadoEvento`) ,
  INDEX `fk_estadosEvento_tipoevento1_idx` (`idTipoEvento` ASC) ,
  CONSTRAINT `fk_estadosEvento_tipoevento1`
    FOREIGN KEY (`idTipoEvento` )
    REFERENCES `cerberus`.`tipoevento` (`idTipoEvento` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`empresas`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`empresas` (
  `idEmpresa` INT NOT NULL AUTO_INCREMENT ,
  `Nombre` VARCHAR(80) NOT NULL ,
  PRIMARY KEY (`idEmpresa`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`sectores`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`sectores` (
  `idDelegacion` INT NOT NULL ,
  `idSector` VARCHAR(15) NOT NULL ,
  `Nombre` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`idDelegacion`, `idSector`) ,
  INDEX `fk_sectores_delegaciones1` (`idDelegacion` ASC) ,
  CONSTRAINT `fk_sectores_delegaciones1`
    FOREIGN KEY (`idDelegacion` )
    REFERENCES `cerberus`.`delegaciones` (`idDelegacion` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`obras`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`obras` (
  `idObra` INT NOT NULL AUTO_INCREMENT ,
  `codigoObra` VARCHAR(45) NOT NULL ,
  `Nombre` VARCHAR(80) NOT NULL ,
  `fechaIni` DATETIME NULL ,
  `fechaFin` DATETIME NULL ,
  `Responsable` VARCHAR(120) NULL ,
  `mesInfo` VARCHAR(45) NULL ,
  PRIMARY KEY (`idObra`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`tiposobra`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`tiposobra` (
  `idTipoObra` INT NOT NULL ,
  `nombre` VARCHAR(80) NOT NULL ,
  PRIMARY KEY (`idTipoObra`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`datosobra`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`datosobra` (
  `idObra` INT NOT NULL ,
  `idDelegacion` INT NOT NULL ,
  `idSector` VARCHAR(15) NOT NULL ,
  `idTipoObra` INT NOT NULL ,
  `fechaRealIni` DATETIME NULL ,
  `fechaRealFin` DATETIME NULL ,
  `Constructora` VARCHAR(120) NULL ,
  `Vigilante` VARCHAR(120) NULL ,
  `Resultado` VARCHAR(45) NULL ,
  `Alcance` LONGTEXT NULL ,
  `TipoObra` VARCHAR(120) NULL ,
  `JefeGrupo` VARCHAR(255) NULL ,
  `Ronda` VARCHAR(60) NULL ,
  PRIMARY KEY (`idObra`) ,
  INDEX `fk_datosobra_sectores1` (`idDelegacion` ASC, `idSector` ASC) ,
  INDEX `fk_datosobra_tiposobra1` (`idTipoObra` ASC) ,
  CONSTRAINT `fk_datosobra_obras1`
    FOREIGN KEY (`idObra` )
    REFERENCES `cerberus`.`obras` (`idObra` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_datosobra_sectores1`
    FOREIGN KEY (`idDelegacion` , `idSector` )
    REFERENCES `cerberus`.`sectores` (`idDelegacion` , `idSector` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_datosobra_tiposobra1`
    FOREIGN KEY (`idTipoObra` )
    REFERENCES `cerberus`.`tiposobra` (`idTipoObra` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`postes`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`postes` (
  `idObra` INT NOT NULL ,
  `Codigo` VARCHAR(45) NOT NULL ,
  `Auditar` INT(11) NULL DEFAULT 0 ,
  INDEX `fk_postes_obras1` (`idObra` ASC) ,
  UNIQUE INDEX `postes_key` (`idObra` ASC, `Codigo` ASC) ,
  CONSTRAINT `fk_postes_obras1`
    FOREIGN KEY (`idObra` )
    REFERENCES `cerberus`.`obras` (`idObra` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`clasificacionmateriales`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`clasificacionmateriales` (
  `Codigo` VARCHAR(30) NOT NULL ,
  `Tipo` VARCHAR(45) NOT NULL ,
  `Descripcion` VARCHAR(90) NOT NULL ,
  `unidadMedida` VARCHAR(15) NULL ,
  PRIMARY KEY (`Codigo`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`presupuesto`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`presupuesto` (
  `idObra` INT NOT NULL ,
  `codigoPoste` VARCHAR(45) NOT NULL ,
  `codigoMaterial` VARCHAR(30) NOT NULL ,
  `aportacionMaterial` VARCHAR(10) NULL ,
  `valorUnitario` BIGINT NULL ,
  `cantidad` VARCHAR(45) NOT NULL DEFAULT 0 ,
  INDEX `fk_presupuesto_clasificacionmateriales1` (`codigoMaterial` ASC) ,
  CONSTRAINT `fk_presupuesto_clasificacionmateriales1`
    FOREIGN KEY (`codigoMaterial` )
    REFERENCES `cerberus`.`clasificacionmateriales` (`Codigo` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`noconformidades`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`noconformidades` (
  `Codigo` VARCHAR(10) NOT NULL ,
  `Descripcion` VARCHAR(120) NOT NULL ,
  `Nota` VARCHAR(10) NOT NULL ,
  `Clasificacion` VARCHAR(10) NOT NULL ,
  `Criterio` VARCHAR(45) NOT NULL ,
  PRIMARY KEY (`Codigo`) )
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`resultadoauditoria`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`resultadoauditoria` (
  `idResultadoAuditoria` BIGINT NOT NULL ,
  `idObra` INT NOT NULL ,
  `codigoPoste` VARCHAR(45) NOT NULL ,
  `codigoNC` VARCHAR(10) NOT NULL ,
  `Resultado` VARCHAR(45) NULL ,
  `comentarioAuditor` LONGTEXT NULL ,
  `comentarioSector` LONGTEXT NULL ,
  PRIMARY KEY (`idResultadoAuditoria`) ,
  INDEX `fk_resultadoauditoria_obras1` (`idObra` ASC) ,
  INDEX `fk_resultadoauditoria_noconformidades1` (`codigoNC` ASC) ,
  CONSTRAINT `fk_resultadoauditoria_obras1`
    FOREIGN KEY (`idObra` )
    REFERENCES `cerberus`.`obras` (`idObra` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_resultadoauditoria_noconformidades1`
    FOREIGN KEY (`codigoNC` )
    REFERENCES `cerberus`.`noconformidades` (`Codigo` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cerberus`.`compromisos`
-- -----------------------------------------------------
CREATE  TABLE IF NOT EXISTS `cerberus`.`compromisos` (
  `idCompromiso` BIGINT NOT NULL ,
  `idObra` INT NOT NULL ,
  `fechaLimite` DATETIME NULL ,
  `Responsable` VARCHAR(120) NULL ,
  `coreoResponsable` VARCHAR(45) NULL ,
  `estado` VARCHAR(45) NOT NULL DEFAULT 'Programado' ,
  PRIMARY KEY (`idCompromiso`) ,
  INDEX `fk_compromisos_obras1` (`idObra` ASC) ,
  CONSTRAINT `fk_compromisos_obras1`
    FOREIGN KEY (`idObra` )
    REFERENCES `cerberus`.`obras` (`idObra` )
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
