import "dotenv/config";
import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";
import whoiser from "whoiser";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

async function getWhoisData(domain) {
  const whoisData = await whoiser.domain(domain, { follow: 1 });
  let selectedWhoisData;
  // TODO: handle edge-case where domain doesn't exist
  for (const registry in whoisData) {
    selectedWhoisData = {
      expiryDate: new Date(whoisData[registry]["Expiry Date"]),
      createdDate: new Date(whoisData[registry]["Created Date"]),
      updatedDate: new Date(whoisData[registry]["Updated Date"]),
      registrar: whoisData[registry]["Registrar"],
    };
  }

  return selectedWhoisData;
}

app.use(ClerkExpressRequireAuth());
app.use(express.json());

app.get("/api/domains", async (req, res) => {
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

app.post("/api/domains/add", async (req, res) => {
  const { domainName, userId } = req.body;

  if (!domainName) {
    return res.status(400).json({ message: "Domain name is missing" });
  }

  if (await prisma.domain.findFirst({ where: { domainName } })) {
    return res.status(409).json({ message: "Domain has already been added" });
  }

  const domainWhoisFields = await getWhoisData(domainName);

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
});

app.delete("/api/domains/:id", async (req, res) => {
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

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
