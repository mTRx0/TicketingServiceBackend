/*
  Warnings:

  - You are about to drop the column `valid_until` on the `RefreshToken` table. All the data in the column will be lost.
  - The required column `tokenFamily` was added to the `RefreshToken` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `validUntil` to the `RefreshToken` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `RefreshToken_valid_until_idx` ON `RefreshToken`;

-- AlterTable
ALTER TABLE `RefreshToken` DROP COLUMN `valid_until`,
    ADD COLUMN `tokenFamily` VARCHAR(191) NOT NULL,
    ADD COLUMN `validUntil` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `RefreshToken_validUntil_idx` ON `RefreshToken`(`validUntil`);
