/*
  Warnings:

  - You are about to alter the column `sold` on the `products` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.

*/
-- AlterTable
ALTER TABLE `products` MODIFY `image` VARCHAR(255) NULL,
    MODIFY `sold` INTEGER NULL DEFAULT 0;
