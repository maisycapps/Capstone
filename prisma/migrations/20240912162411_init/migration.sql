/*
  Warnings:

  - The primary key for the `Likes` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Likes" DROP CONSTRAINT "Likes_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Likes_pkey" PRIMARY KEY ("id");
