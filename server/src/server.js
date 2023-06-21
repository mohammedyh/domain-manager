import "dotenv/config";
import express from "express";
import { ClerkExpressRequireAuth } from "@clerk/clerk-sdk-node";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(ClerkExpressRequireAuth());
app.use(express.json());

app.get("/api/domains", async (req, res) => {
  const domains = await prisma.domain.findMany({
    where: { user: req.auth.userId },
    select: { domainName: true },
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

  const domain = await prisma.domain.create({
    data: {
      domainName,
      user: userId,
    },
  });

  return res.json({ message: "Successfully created domain", domain });
});

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
