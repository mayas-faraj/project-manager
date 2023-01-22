/*
  Warnings:

  - The primary key for the `project_viewer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[user_id,project_id]` on the table `project_viewer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `id` to the `project_viewer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `project_viewer` DROP PRIMARY KEY,
    ADD COLUMN `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- CreateIndex
CREATE UNIQUE INDEX `project_viewer_user_id_project_id_key` ON `project_viewer`(`user_id`, `project_id`);
