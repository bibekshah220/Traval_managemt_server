import mongoose from "mongoose";
import { mongodb_config } from "./config.js";

// A serverless invocation reuses a warm container, so the connection is
// cached on globalThis. Without this each request opens a new pool and
// Atlas drops them once the connection limit is reached.
let cached = globalThis.__mongoose_conn;

if (!cached) {
  cached = globalThis.__mongoose_conn = { conn: null, promise: null };
}

export const connect_db = async () => {
  if (cached.conn) return cached.conn;

  if (!mongodb_config.url) {
    throw new Error("DB_URI is not set in this environment");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongodb_config.url, {
        dbName: mongodb_config.db_name,
        autoCreate: true,
        // fail fast rather than hang the whole invocation
        serverSelectionTimeoutMS: 8000,
        // fail the request instead of queueing it behind a dead connection
        bufferCommands: false,
      })
      .then((m) => {
        console.log("database connected successfully");
        return m;
      })
      .catch((error) => {
        // clear the slot so the next request retries instead of reusing
        // a permanently rejected promise
        cached.promise = null;
        console.log("------------db connection error------------------");
        console.log(error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
