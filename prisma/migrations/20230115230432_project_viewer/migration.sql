-- DropForeignKey
ALTER TABLE `media` DROP FOREIGN KEY `media_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `payment` DROP FOREIGN KEY `payment_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `project_viewer` DROP FOREIGN KEY `project_viewer_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `project_viewer` DROP FOREIGN KEY `project_viewer_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `setting` DROP FOREIGN KEY `setting_userId_fkey`;

-- DropForeignKey
ALTER TABLE `suspend` DROP FOREIGN KEY `suspend_project_id_fkey`;

-- AlterTable
ALTER TABLE `media` ADD COLUMN `orderIndex` INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE `project_viewer` ADD CONSTRAINT `project_viewer_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_viewer` ADD CONSTRAINT `project_viewer_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `media` ADD CONSTRAINT `media_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `payment` ADD CONSTRAINT `payment_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `suspend` ADD CONSTRAINT `suspend_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `setting` ADD CONSTRAINT `setting_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
