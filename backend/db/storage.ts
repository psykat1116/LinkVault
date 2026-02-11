require("dotenv").config();
import { Client, Storage } from "node-appwrite";

export const client = new Client()
  .setEndpoint(process.env.APPWRITE_PROJECT_ENDPOINT!)
  .setProject(process.env.APPWRITE_PROJECT_ID!)
  .setKey(process.env.APPWRITE_API_KEY!);

export const storage = new Storage(client);
