import { File } from "../schema/file";
import { storage } from "../lib/appwrite";
import { AppwriteException } from "node-appwrite";

const CLEANUP_INTERVAL_MS = 60 * 1000;

async function cleanupExpiredFiles() {
  try {
    const expiredFiles = await File.find({ expiresAt: { $lte: new Date() } });
    if (expiredFiles.length === 0) return;

    let removed = 0;
    for (const file of expiredFiles) {
      try {
        await storage.deleteFile(file.bucketId, file.fileid);
      } catch (err) {
        if (err instanceof AppwriteException && err.code === 404) {
          // File already gone from Appwrite — still remove the DB record
        } else {
          // Appwrite unreachable or unexpected error — leave DB record, retry next cycle
          continue;
        }
      }
      
      await File.deleteOne({ _id: file._id });
      removed++;
    }

    if (removed > 0) {
      console.log(`Cleanup: removed ${removed} expired file(s) from Appwrite`);
    }
  } catch (err) {
    console.error("Cleanup job error:", err);
  }
}

export function startCleanupJob() {
  cleanupExpiredFiles();
  setInterval(cleanupExpiredFiles, CLEANUP_INTERVAL_MS);
}
