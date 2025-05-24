-- AlterEnum
ALTER TYPE "PostStatus" ADD VALUE 'DELETED';

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "deletedAt" TIMESTAMP(3);
