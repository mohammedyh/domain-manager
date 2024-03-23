import "dotenv/config";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import router from "./router.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(helmet());
app.use(ClerkExpressWithAuth());
app.use(express.json());

app.use("/api", router);

app.use((err, req, res) => {
  console.error(err.stack);
  return res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

const server = app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);

process.on("SIGTERM", () => {
  console.info("SIGTERM signal received. Closing server");
  server.close(() => {
    console.log("Server closed");
    process.exit(0);
  });
});
