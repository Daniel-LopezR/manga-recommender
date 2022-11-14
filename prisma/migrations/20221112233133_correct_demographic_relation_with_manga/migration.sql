/*
  Warnings:

  - You are about to drop the `GenresAndDemographicsOnMangas` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `demographicId` to the `Manga` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Manga` ADD COLUMN `demographicId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `GenresAndDemographicsOnMangas`;

-- CreateTable
CREATE TABLE `GenresOnMangas` (
    `mangaId` INTEGER NOT NULL,
    `genreId` INTEGER NOT NULL,

    PRIMARY KEY (`mangaId`, `genreId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
