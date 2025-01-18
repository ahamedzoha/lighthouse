import { Worker } from "@temporalio/worker"
import { activities } from "./activities"

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
