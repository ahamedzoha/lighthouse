import { Client } from "@temporalio/client"
import { dseScraperWorkflow } from "../workflows/dseScraperWorkflow"

async function run() {
  const client = new Client()

  try {
    const workflowId = `dse-scraper-manual-${Date.now()}`
    const handle = await client.workflow.start(dseScraperWorkflow, {
      taskQueue: "scraping",
      workflowId,
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
