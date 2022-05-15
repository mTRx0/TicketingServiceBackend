-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_inviteCodeUsedId_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `inviteCodeUsedId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_inviteCodeUsedId_fkey` FOREIGN KEY (`inviteCodeUsedId`) REFERENCES `InviteCode`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
