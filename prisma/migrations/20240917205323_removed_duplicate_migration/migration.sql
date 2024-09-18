-- DropIndex
DROP INDEX "Comments_postId_key";

-- DropIndex
DROP INDEX "Comments_userId_key";

-- DropIndex
DROP INDEX "Likes_postId_key";

-- DropIndex
DROP INDEX "Likes_userId_key";

-- DropIndex
DROP INDEX "Posts_userId_key";

-- AlterTable
ALTER TABLE "Destinations" ADD COLUMN     "destinationImg" TEXT;

-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "postImg" TEXT;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "profileImg" TEXT;
