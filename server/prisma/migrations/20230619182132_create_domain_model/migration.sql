-- CreateTable
CREATE TABLE "Domain" (
    "id" SERIAL NOT NULL,
    "user" TEXT NOT NULL,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "registeredDate" TIMESTAMP(3) NOT NULL,
    "updatedDate" TIMESTAMP(3) NOT NULL,
    "dnsRecords" JSONB NOT NULL,
    "registrar" TEXT NOT NULL,
    "sslInfo" JSONB NOT NULL,

    CONSTRAINT "Domain_pkey" PRIMARY KEY ("id")
);
