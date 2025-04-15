import { Client } from "@temporalio/client";
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
export declare function getTemporalClient(): Promise<Client>;
