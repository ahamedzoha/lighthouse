import { Client, SearchAttributes } from "@temporalio/client"
import { dseScraperWorkflow } from "./workflows/dseScraperWorkflow"

async function run() {
  const client = new Client()

  try {
    const scheduleId = "dse-market-schedule"

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
        workflowType: dseScraperWorkflow,
        args: [true],
        taskQueue: "scraping",
        workflowId: "dse-scraper-${scheduleTime}",
        memo: {
          description: "DSE Stock Market Scraper",
          schedule:
            "Every 2 minutes during trading hours (10:00-14:30 BD time)",
        },
        searchAttributes: {
          CustomStringField: ["dse_scraper"],
        } as SearchAttributes,
      },
    })

    console.log(`DSE scraper schedule created with ID: ${scheduleId}`)
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ScheduleAlreadyRunning") {
      console.log(
        "Schedule already exists. Use 'temporal schedule delete dse-market-schedule' to remove it first."
      )
    } else {
      console.error("Failed to create schedule:", error)
    }
    process.exit(1)
  }
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
