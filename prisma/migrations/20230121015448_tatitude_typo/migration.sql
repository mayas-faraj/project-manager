/*
  Warnings:

  - You are about to drop the column `latitutude` on the `project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `project` DROP COLUMN `latitutude`,
    ADD COLUMN `latitude` DOUBLE NULL;
