/*
  Warnings:

  - You are about to alter the column `accessToken` on the `AuthToken` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - You are about to alter the column `refreshToken` on the `AuthToken` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.

*/
-- AlterTable
ALTER TABLE `AuthToken` MODIFY `accessToken` VARCHAR(191) NOT NULL,
    MODIFY `refreshToken` VARCHAR(191) NOT NULL;
