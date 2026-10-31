import mongoose from "mongoose";
import { mongodb_config } from "./config.js";

// Warm containers reuse the process, so cache the pool or Atlas hits its limit.
let cached = globalThis.__mongoose_conn;

if (!cached) {
  cached = globalThis.__mongoose_conn = { conn: null, promise: null };
}

export const connect_db = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongodb_config.url, {
        dbName: mongodb_config.db_name,
        autoCreate: true,
        // fail fast rather than hang the whole invocation
        serverSelectionTimeoutMS: 8000,
        bufferCommands: false,
      })
      .then((m) => {
        console.log("database connected successfully");
        return m;
      })
      .catch((error) => {
        cached.promise = null; // let the next request retry

        console.log("------------db connection error------------------");
        console.log(error);
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};
