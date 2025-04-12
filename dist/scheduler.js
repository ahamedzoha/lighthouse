"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@temporalio/client");
const dseScraperWorkflow_1 = require("./workflows/dseScraperWorkflow");
async function run() {
    const client = new client_1.Client();
    try {
        const scheduleId = "dse-market-schedule";
        await client.schedule.create({
            scheduleId,
            spec: {
                // Runs every 2 minutes during trading hours (10:00-14:30 BD time)
                cronExpressions: ["*/2 10-14 * * 0-4"],
                // Timezone for Bangladesh
                timezone: "Asia/Dhaka",
            },
            action: {
                type: "startWorkflow",
                workflowType: dseScraperWorkflow_1.dseScraperWorkflow,
                args: [true],
                taskQueue: "scraping",
                workflowId: "dse-scraper-${scheduleTime}",
                memo: {
                    description: "DSE Stock Market Scraper",
                    schedule: "Every 2 minutes during trading hours (10:00-14:30 BD time)",
                },
                searchAttributes: {
                    CustomStringField: ["dse_scraper"],
                },
            },
        });
        console.log(`DSE scraper schedule created with ID: ${scheduleId}`);
    }
    catch (error) {
        if (error instanceof Error && error.name === "ScheduleAlreadyRunning") {
            console.log("Schedule already exists. Use 'temporal schedule delete dse-market-schedule' to remove it first.");
        }
        else {
            console.error("Failed to create schedule:", error);
        }
        process.exit(1);
    }
}
run().catch((err) => {
    console.error(err);
    process.exit(1);
});
