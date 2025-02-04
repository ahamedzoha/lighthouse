import { proxyActivities } from "@temporalio/workflow"
import { Activities } from "../activities"

const { scrapeActivity, validateActivity, insertDbActivity } =
  proxyActivities<Activities>({
    startToCloseTimeout: "2 minutes",
    retry: {
      maximumAttempts: 3,
      initialInterval: "10 seconds",
    },
  })

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
 */
export async function dseScraperWorkflow(): Promise<void> {
  // Simple trading hours check (10:00-14:30 BD time)
  const now = new Date()
  const hour = now.getHours()
  if (hour < 10 || hour > 14) return

  const rawData = await scrapeActivity()
  const validatedData = await validateActivity(rawData)
  await insertDbActivity(validatedData)
}
