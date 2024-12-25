import { getAllDnsRecords } from "@layered/dns-records";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { getCertStatusByDomain } from "easy-ocsp";

import { getWhoisData, getSSLCertificate } from "./utils.js";

const router = Router();
const prisma = new PrismaClient();

router.get("/domains", async (req, res) => {
  const { userId } = req.auth;
  const domains = await prisma.domain.findMany({
    where: { user: userId },
    select: {
      id: true,
      domainName: true,
      registrar: true,
      expiryDate: true,
      registeredDate: true,
      updatedDate: true,
    },
  });

  const sslPromises = domains.map((domain) =>
    getSSLCertificate(domain.domainName)
  );
  const sslInfo = await Promise.allSettled(sslPromises);

  if (!domains) {
    return res.status(200).json({ message: "No domains found" });
  }
  return res.status(200).json({ domains, sslInfo });
});

router.post("/domains/add", async (req, res) => {
  const { userId } = req.auth;
  const { domainName } = req.body;

  if (!domainName) {
    return res.status(400).json({ message: "Domain name is missing" });
  }

  if (await prisma.domain.findFirst({ where: { user: userId, domainName } })) {
    return res.status(409).json({ message: "Domain has already been added" });
  }

  try {
    const domainWhoisFields = await getWhoisData(domainName);
    if (
      !domainWhoisFields.createdDate ||
      !domainWhoisFields.registrar ||
      !domainWhoisFields.expiryDate
    ) {
      return res
        .status(404)
        .json({ message: "Failed to fetch complete domain information" });
    }

    const domain = await prisma.domain.create({
      data: {
        domainName,
        user: userId,
        registrar: domainWhoisFields.registrar,
        expiryDate: domainWhoisFields.expiryDate,
        registeredDate: domainWhoisFields.createdDate,
        updatedDate: domainWhoisFields.updatedDate,
      },
    });
    return res.json({ message: "Successfully created domain", domain });
  } catch (error) {
    return res.status(404).json({ message: error.message });
  }
});

router.get("/domains/:domainName", async (req, res) => {
  const { domainName } = req.params;
  const records = await getAllDnsRecords(domainName);
  let sslInfo, sslStatus;

  try {
    sslInfo = await getSSLCertificate(domainName);
    sslStatus = await getCertStatusByDomain(domainName);
  } catch (error) {
    sslInfo = `Unable to retrieve SSL information for ${domainName}`;
  }

  return res.status(200).json({ domain: domainName, records, sslInfo, sslStatus });
});

router.delete("/domains/:domainId", async (req, res) => {
  const { userId } = req.auth;
  const { domainId } = req.params;

  if (!domainId) {
    return res.status(400).json({ error: "Domain ID not provided." });
  }

  try {
    await prisma.domain.delete({
      where: { user: userId, id: parseInt(domainId) },
    });
    return res.status(200).json({ message: "Domain deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
});

export default router;
