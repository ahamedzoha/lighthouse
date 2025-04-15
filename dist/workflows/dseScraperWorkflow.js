import { proxyActivities } from "@temporalio/workflow";
const { scrapeActivity, validateActivity, insertDbActivity } = proxyActivities({
    startToCloseTimeout: "2 minutes",
    retry: {
        maximumAttempts: 3,
        initialInterval: "10 seconds",
    },
});
/**
 * Workflow for scraping DSE stock data.
 *
 * This workflow is executed by the Temporal worker. It performs a simple trading hours check,
 * and if within trading hours (10:00–14:00), it executes the following activities sequentially:
 * 1. Scrape the data.
 * 2. Validate the scraped data using Zod.
 * 3. Insert the validated data into the database.
 *
 * @example
 * // This workflow is usually scheduled by Temporal and executed by a worker.
 * await dseScraperWorkflow();
 * await dseScraperWorkflow(true); // Bypass trading hours check
 *
 * @param bypassTradingHoursCheck - Optional flag to bypass trading hours check
 */
export async function dseScraperWorkflow(bypassTradingHoursCheck = false) {
    // Simple trading hours check (10:00-14:30 BD time)
    const now = new Date();
    const hour = now.getHours();
    if (!bypassTradingHoursCheck && (hour < 10 || hour > 14))
        return;
    try {
        const rawData = await scrapeActivity();
        console.log("Scraped data sample:", rawData[0]);
        const validatedData = await validateActivity(rawData);
        console.log("Validation successful");
        await insertDbActivity(validatedData);
        console.log("Data inserted successfully");
    }
    catch (error) {
        console.error("Workflow failed:", error);
        throw error;
    }
}
