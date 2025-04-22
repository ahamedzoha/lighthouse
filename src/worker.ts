import { Worker, NativeConnection } from "@temporalio/worker"
import { activities } from "./activities/index"
// import { fileURLToPath } from "url"
// import path from "path"

/**
 * Initializes and runs the Temporal worker.
 * 
 * This worker connects to the Temporal server, registers activities and workflows,
 * and listens on the "scraping" task queue for workflow tasks.
 * 
 * The worker is responsible for executing the scraping activities when
 * triggered by the Temporal scheduler.
 *
 * @example
 * // To start the worker:
 * // npm run start:worker
 * // or in development:
 * // npm run dev:worker
 * 
 * @returns {Promise<void>} A promise that resolves when the worker starts successfully or rejects on error
 */
async function run() {
 

  try {
    const temporalAddress = process.env.TEMPORAL_ADDRESS || "temporal:7233"
    console.log(`Connecting to Temporal server at ${temporalAddress}`)

    // Create connection explicitly
    const connection = await NativeConnection.connect({
      address: temporalAddress,
    })

    // Create worker with explicit connection
    const worker = await Worker.create({
      connection,
      workflowsPath: require.resolve("./workflows/dseScraperWorkflow"),
      activities,
      taskQueue: "scraping",
    })

    console.log("Worker created successfully")
    await worker.run()
  } catch (error) {
    console.error("Error creating worker:", error)
    throw error
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
