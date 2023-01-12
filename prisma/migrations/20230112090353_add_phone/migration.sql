/*
  Warnings:

  - Added the required column `phone` to the `engineer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `engineer` ADD COLUMN `phone` VARCHAR(50) NOT NULL;
