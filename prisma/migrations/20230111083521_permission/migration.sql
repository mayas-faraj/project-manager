/*
  Warnings:

  - You are about to drop the column `lastLoginAt` on the `user` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `engineer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `media` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `suspend` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `department` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `engineer` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `media` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `project` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `suspend` ADD COLUMN `user_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` DROP COLUMN `lastLoginAt`,
    ADD COLUMN `last_login_at` DATETIME(3) NULL;

-- CreateTable
CREATE TABLE `project_viewer` (
    `user_id` INTEGER NOT NULL,
    `project_id` INTEGER NOT NULL,
    `assigned_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`user_id`, `project_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `company` ADD CONSTRAINT `company_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `department` ADD CONSTRAINT `department_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `engineer` ADD CONSTRAINT `engineer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project` ADD CONSTRAINT `project_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_viewer` ADD CONSTRAINT `project_viewer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_viewer` ADD CONSTRAINT `project_viewer_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media` ADD CONSTRAINT `media_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suspend` ADD CONSTRAINT `suspend_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
