/*
  Warnings:

  - You are about to drop the column `phone` on the `engineer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `engineer` DROP COLUMN `phone`,
    ADD COLUMN `avatar` VARCHAR(250) NULL;
