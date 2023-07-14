import "dotenv/config";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import express from "express";
import morgan from "morgan";
import router from "./router.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(ClerkExpressWithAuth());
app.use(express.json());

app.use("/api", router);

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
