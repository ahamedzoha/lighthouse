"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemporalClient = getTemporalClient;
const client_1 = require("@temporalio/client");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
async function getTemporalClient() {
    const connection = await client_1.Connection.connect({
        address: process.env.TEMPORAL_ADDRESS || "localhost:7233",
        // Add TLS settings if needed
    });
    return new client_1.Client({
        connection,
        namespace: "default", // specify default namespace
    });
}
