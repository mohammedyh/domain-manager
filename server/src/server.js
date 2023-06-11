import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (_, res) => res.status(200).json({ success: true }));

app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
