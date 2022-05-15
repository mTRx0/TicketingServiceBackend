/*
  Warnings:

  - You are about to drop the column `tokenFamily` on the `RefreshToken` table. All the data in the column will be lost.
  - The required column `tokenFamilyId` was added to the `RefreshToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `RefreshToken` DROP COLUMN `tokenFamily`,
    ADD COLUMN `tokenFamilyId` VARCHAR(191) NOT NULL;
