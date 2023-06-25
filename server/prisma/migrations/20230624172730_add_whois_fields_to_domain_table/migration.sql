/*
  Warnings:

  - Added the required column `expiryDate` to the `Domain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registeredDate` to the `Domain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrar` to the `Domain` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedDate` to the `Domain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Domain" ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "registeredDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "registrar" TEXT NOT NULL,
ADD COLUMN     "updatedDate" TIMESTAMP(3) NOT NULL;
