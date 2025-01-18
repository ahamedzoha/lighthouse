import { Connection, Client } from "@temporalio/client"
import dotenv from "dotenv"

dotenv.config()

export async function getTemporalClient(): Promise<Client> {
  const connection = await Connection.connect({
    address: process.env.TEMPORAL_ADDRESS || "localhost:7233",
    // Add TLS settings if needed
  })
  return new Client({
    connection,
    namespace: "default", // specify default namespace
  })
}
