-- AlterTable
ALTER TABLE `AuthToken` MODIFY `accessToken` VARCHAR(255) NOT NULL,
    MODIFY `refreshToken` VARCHAR(255) NOT NULL;
