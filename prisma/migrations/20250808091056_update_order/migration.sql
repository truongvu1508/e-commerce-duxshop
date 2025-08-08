-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_userId_fkey`;

-- DropIndex
DROP INDEX `orders_userId_key` ON `orders`;

-- AddForeignKey
ALTER TABLE `order_detail` ADD CONSTRAINT `order_detail_productId_fkey_new` FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;