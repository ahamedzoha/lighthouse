import { Client } from "@temporalio/client"
import { dseScraperWorkflow } from "./workflows/dseScraperWorkflow"

async function run() {
  const client = new Client()

  try {
    await client.workflow.start(dseScraperWorkflow, {
      taskQueue: "scraping",
      workflowId: "dse-scraper",
      cronSchedule: "*/2 10-14 * * 0-4", // Every 2 minutes during trading hours
    })
    console.log("DSE scraper workflow scheduled")
  } catch (error) {
    console.error("Failed to schedule workflow:", error)
    process.exit(1)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
