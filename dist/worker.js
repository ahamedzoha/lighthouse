import { Worker, NativeConnection } from "@temporalio/worker";
import { activities } from "./activities/index.js";
import { fileURLToPath } from "url";
import path from "path";
/**
 * Initializes and runs the Temporal worker.
 *
 * This worker listens on the "scraping" task queue for workflow tasks and runs them.
 *
 * @example
 * // To start the worker:
 * // npm run start:worker
 */
async function run() {
    // Get the current file's directory in ESM
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    // Log for debugging
    console.log("Current directory:", __dirname);
    try {
        const temporalAddress = process.env.TEMPORAL_ADDRESS || 'temporal:7233';
        console.log(`Connecting to Temporal server at ${temporalAddress}`);
        // Create connection explicitly
        const connection = await NativeConnection.connect({
            address: temporalAddress
        });
        // Create worker with explicit connection
        const worker = await Worker.create({
            connection,
            workflowsPath: path.resolve(__dirname, 'workflows', 'dseScraperWorkflow.ts'),
            activities,
            taskQueue: "scraping"
        });
        console.log("Worker created successfully");
        await worker.run();
    }
    catch (error) {
        console.error("Error creating worker:", error);
        throw error;
    }
}
run().catch((err) => {
    console.error(err);
    process.exit(1);
});
