/*
  Warnings:

  - Made the column `inviteCodeUsedId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_inviteCodeUsedId_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `inviteCodeUsedId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_inviteCodeUsedId_fkey` FOREIGN KEY (`inviteCodeUsedId`) REFERENCES `InviteCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
