import express from "express";
import "dotenv/config";
import clerk from "@clerk/clerk-sdk-node";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (_, res) => res.status(200).json({ success: true }));

const userList = await clerk.users.getUserList();
console.log(userList);

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
