/*
  Warnings:

  - You are about to drop the column `from_date` on the `extensions` table. All the data in the column will be lost.
  - You are about to drop the column `to_date` on the `extensions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `extensions` DROP COLUMN `from_date`,
    DROP COLUMN `to_date`,
    ADD COLUMN `byDuration` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `documentUrl` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `latitutude` DOUBLE NULL,
    ADD COLUMN `longitude` DOUBLE NULL;

-- AlterTable
ALTER TABLE `suspend` ADD COLUMN `documentUrl` VARCHAR(191) NULL;
