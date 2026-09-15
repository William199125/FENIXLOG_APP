-- AlterTable
ALTER TABLE `orden` ADD COLUMN `fotoBase64` LONGTEXT NULL,
    ADD COLUMN `latitud` DOUBLE NULL,
    ADD COLUMN `longitud` DOUBLE NULL;
