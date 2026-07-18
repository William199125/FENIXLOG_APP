-- AlterTable
ALTER TABLE `orden` ADD COLUMN `vehiculoId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Vehiculo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `unidad` VARCHAR(191) NOT NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `placa` VARCHAR(191) NULL,
    `registro` VARCHAR(191) NOT NULL,
    `kilometraje` INTEGER NULL,
    `estado` VARCHAR(191) NOT NULL,
    `enUnidad` BOOLEAN NOT NULL DEFAULT false,
    `empleo` VARCHAR(191) NOT NULL,
    `provincia` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Vehiculo_registro_key`(`registro`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Orden` ADD CONSTRAINT `Orden_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `Vehiculo`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
