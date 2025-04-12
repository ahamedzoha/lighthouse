"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@temporalio/client");
const dseScraperWorkflow_1 = require("../workflows/dseScraperWorkflow");
/**
 * Schedules the DSE scraper workflow using Temporal's cron functionality.
 *
 * This script creates a schedule for the DSE scraper workflow with a cron expression
 * that runs the workflow every 2 minutes between 10:00 and 14:00 on weekdays.
 *
 * @example
 * // To schedule the workflow:
 * // npm run start:scheduler
 */
async function run() {
    const client = new client_1.Client();
    // Schedule workflow with Temporal cron
    await client.workflow.start(dseScraperWorkflow_1.dseScraperWorkflow, {
        taskQueue: "scraping",
        workflowId: "dse-scraper",
        cronSchedule: "*/2 10-14 * * 0-4", // Same schedule as before
    });
}
run().catch((err) => {
    console.error(err);
    process.exit(1);
});
