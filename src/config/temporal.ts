import { Connection, Client } from "@temporalio/client"
import dotenv from "dotenv"

dotenv.config()

/**
 * Creates and returns a configured Temporal client.
 *
 * This function connects to the Temporal server using the address specified in the environment
 * variable TEMPORAL_ADDRESS (defaults to localhost:7233) and uses the default namespace.
 *
 * @returns {Promise<Client>} A Promise that resolves with the Temporal client instance.
 *
 * @example
 * (async () => {
 *   const client = await getTemporalClient();
 *   const handle = await client.workflow.start(someWorkflow, { taskQueue: "myQueue", workflowId: "workflow-1" });
 *   console.log("Workflow started:", handle.workflowId);
 * })();
 */
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
