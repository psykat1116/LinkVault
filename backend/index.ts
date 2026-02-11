require("dotenv").config();

import cors from "cors";
import express from "express";
import authRoute from "./router/auth.routes";
import userRoute from "./router/user.routes";
import pasteRoute from "./router/paste.routes";
import type { Request, Response } from "express";
import { connectToDatabase, disconnectFromDatabase } from "./db/connect";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Link Vault Backend is hello!");
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/paste", pasteRoute);

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });

process.on("SIGINT", disconnectFromDatabase);
process.on("SIGTERM", disconnectFromDatabase);
