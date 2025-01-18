import { Client } from "@temporalio/client"
import { dseScraperWorkflow } from "../workflows/dseScraperWorkflow"

async function run() {
  const client = new Client()

  // Schedule workflow with Temporal cron
  await client.workflow.start(dseScraperWorkflow, {
    taskQueue: "scraping",
    workflowId: "dse-scraper",
    cronSchedule: "*/2 10-14 * * 0-4", // Same schedule as before
  })
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
