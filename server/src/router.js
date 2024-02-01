import dnsRecords from "@layered/dns-records";
import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import sslChecker from "ssl-checker";
import { getWhoisData } from "./utils.js";

const router = Router();
const prisma = new PrismaClient();

router.get("/domains", async (req, res) => {
  if (!req.auth.userId) {
    console.log("no auth user id");
    return res.status(401).json({
      message: "Unauthorized",
      description:
        "Authentication failed due to invalid or missing credentials.",
    });
  }

  const domains = await prisma.domain.findMany({
    where: { user: req.auth.userId },
    select: {
      id: true,
      domainName: true,
      registrar: true,
      expiryDate: true,
      registeredDate: true,
      updatedDate: true,
    },
  });

  if (!domains) {
    return res.status(200).json({ message: "No domains found" });
  }
  return res.status(200).json({ domains, success: "true" });
});

router.post("/domains/add", async (req, res) => {
  const { domainName } = req.body;
  const { userId } = req.auth;

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
  const records = await dnsRecords.getAllDnsRecords(domainName);
  const filteredRecords = Object.values(records).flatMap((recordType) =>
    recordType.filter((recordObj) => recordObj.name === domainName)
  );
  let sslInfo;

  try {
    sslInfo = await sslChecker(domainName);
  } catch (error) {
    sslInfo = `Unable to retrieve SSL information for ${domainName}`;
  }

  return res
    .status(200)
    .json({ domain: domainName, records: filteredRecords, sslInfo });
});

router.delete("/domains/:id", async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ error: "Domain ID not provided." });
  }

  try {
    await prisma.domain.delete({ where: { id: parseInt(req.params.id) } });
    return res.status(200).json({ message: "Domain deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong." });
  }
});

export default router;
