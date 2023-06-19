import { Prisma, PrismaClient } from "@prisma/client";
import "dotenv/config";
import express from "express";

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// const userList = await clerk.users.getUserList();

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
