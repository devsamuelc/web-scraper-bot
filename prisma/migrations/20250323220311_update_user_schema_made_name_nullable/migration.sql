/*
  Warnings:

  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `queries` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `websites` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `schedules` on the `users` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropIndex
DROP INDEX "users_chatId_key";

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
DROP COLUMN "queries",
ADD COLUMN     "queries" JSON NOT NULL,
DROP COLUMN "websites",
ADD COLUMN     "websites" JSON NOT NULL,
DROP COLUMN "schedules",
ADD COLUMN     "schedules" JSON NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
