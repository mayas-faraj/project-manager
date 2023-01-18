/*
  Warnings:

  - You are about to drop the column `address` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `company_id` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `engineer_id` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `excerpt` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `location_latitude` on the `project` table. All the data in the column will be lost.
  - You are about to drop the column `location_longitude` on the `project` table. All the data in the column will be lost.
  - You are about to drop the `company` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `engineer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `company` DROP FOREIGN KEY `company_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `department` DROP FOREIGN KEY `department_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `engineer` DROP FOREIGN KEY `engineer_department_id_fkey`;

-- DropForeignKey
ALTER TABLE `engineer` DROP FOREIGN KEY `engineer_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `project_company_id_fkey`;

-- DropForeignKey
ALTER TABLE `project` DROP FOREIGN KEY `project_engineer_id_fkey`;

-- AlterTable
ALTER TABLE `project` DROP COLUMN `address`,
    DROP COLUMN `company_id`,
    DROP COLUMN `engineer_id`,
    DROP COLUMN `excerpt`,
    DROP COLUMN `location_latitude`,
    DROP COLUMN `location_longitude`,
    ADD COLUMN `avatar` VARCHAR(500) NULL,
    ADD COLUMN `companyName` VARCHAR(50) NULL,
    ADD COLUMN `engineer_department` VARCHAR(100) NULL,
    ADD COLUMN `engineer_name` VARCHAR(50) NULL,
    ADD COLUMN `engineer_phone` VARCHAR(50) NULL;

-- DropTable
DROP TABLE `company`;

-- DropTable
DROP TABLE `department`;

-- DropTable
DROP TABLE `engineer`;

-- CreateTable
CREATE TABLE `extensions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `from_date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `to_date` DATETIME(3) NOT NULL,
    `description` VARCHAR(500) NULL,
    `project_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `extensions` ADD CONSTRAINT `extensions_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `extensions` ADD CONSTRAINT `extensions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
