import { Worker } from "@temporalio/worker"
import { activities } from "./activities"

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
  const worker = await Worker.create({
    workflowsPath: require.resolve("./workflows/dseScraperWorkflow"),
    activities,
    taskQueue: "scraping",
  })

  await worker.run()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
