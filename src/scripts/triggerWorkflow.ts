import { Client } from "@temporalio/client"
import { dseScraperWorkflow } from "../workflows/dseScraperWorkflow.ts"

/**
 * Triggers a manual instance of the DSE scraper workflow.
 *
 * This script starts the dseScraperWorkflow as a one-off manual workflow and optionally
 * waits for its result.
 *
 * @example
 * // To trigger the workflow manually:
 * // npm run workflow:trigger
 */
async function run() {
  const client = new Client()

  try {
    const workflowId = `dse-scraper-manual-${Date.now()}`
    const bypassTradingHoursCheck = true
    const handle = await client.workflow.start(dseScraperWorkflow, {
      taskQueue: "scraping",
      workflowId,
      args: [bypassTradingHoursCheck],
    })

    console.log(`Manual workflow started with ID: ${workflowId}`)
    // Optionally wait for result
    const result = await handle.result()
    console.log("Workflow completed:", result)
  } catch (error) {
    console.error("Failed to trigger workflow:", error)
    process.exit(1)
  }
}

run().catch(console.error)
