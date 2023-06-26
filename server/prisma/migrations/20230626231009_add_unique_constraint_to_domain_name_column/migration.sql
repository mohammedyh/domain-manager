/*
  Warnings:

  - A unique constraint covering the columns `[domainName]` on the table `Domain` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Domain_domainName_key" ON "Domain"("domainName");
