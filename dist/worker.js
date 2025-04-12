"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = require("@temporalio/worker");
const activities_1 = require("./activities");
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
    const worker = await worker_1.Worker.create({
        workflowsPath: require.resolve("./workflows/dseScraperWorkflow"),
        activities: activities_1.activities,
        taskQueue: "scraping",
    });
    await worker.run();
}
run().catch((err) => {
    console.error(err);
    process.exit(1);
});
