import { Client, Storage } from "appwrite";

export const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_PROJECT_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID)
  .setDevKey(import.meta.env.VITE_APPWRITE_API_KEY);

export const storage = new Storage(client);