/*
  Warnings:

  - You are about to drop the column `dnsRecords` on the `Domain` table. All the data in the column will be lost.
  - You are about to drop the column `expiryDate` on the `Domain` table. All the data in the column will be lost.
  - You are about to drop the column `registeredDate` on the `Domain` table. All the data in the column will be lost.
  - You are about to drop the column `registrar` on the `Domain` table. All the data in the column will be lost.
  - You are about to drop the column `sslInfo` on the `Domain` table. All the data in the column will be lost.
  - You are about to drop the column `updatedDate` on the `Domain` table. All the data in the column will be lost.
  - Added the required column `domainName` to the `Domain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Domain" DROP COLUMN "dnsRecords",
DROP COLUMN "expiryDate",
DROP COLUMN "registeredDate",
DROP COLUMN "registrar",
DROP COLUMN "sslInfo",
DROP COLUMN "updatedDate",
ADD COLUMN     "domainName" TEXT NOT NULL;
