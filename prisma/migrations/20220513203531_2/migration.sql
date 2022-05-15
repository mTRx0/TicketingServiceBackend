-- DropForeignKey
ALTER TABLE `InviteCode` DROP FOREIGN KEY `InviteCode_createdById_fkey`;

-- AlterTable
ALTER TABLE `InviteCode` MODIFY `createdById` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `InviteCode` ADD CONSTRAINT `InviteCode_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
