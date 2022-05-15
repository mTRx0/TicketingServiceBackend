/*
  Warnings:

  - You are about to drop the column `isManager` on the `User` table. All the data in the column will be lost.
  - Added the required column `organizationId` to the `InviteCode` table without a default value. This is not possible if the table is not empty.
  - Made the column `createdById` on table `InviteCode` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `isOrganizationManager` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organizationId` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `inviteCodeUsedId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `InviteCode` DROP FOREIGN KEY `InviteCode_createdById_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_inviteCodeUsedId_fkey`;

-- AlterTable
ALTER TABLE `InviteCode` ADD COLUMN `organizationId` VARCHAR(191) NOT NULL,
    MODIFY `createdById` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `isManager`,
    ADD COLUMN `isOrganizationManager` BOOLEAN NOT NULL,
    ADD COLUMN `organizationId` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `inviteCodeUsedId` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Organization` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `employeesAmount` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_inviteCodeUsedId_fkey` FOREIGN KEY (`inviteCodeUsedId`) REFERENCES `InviteCode`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InviteCode` ADD CONSTRAINT `InviteCode_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InviteCode` ADD CONSTRAINT `InviteCode_createdById_fkey` FOREIGN KEY (`createdById`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
