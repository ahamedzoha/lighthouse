import { Client, SearchAttributes, Connection } from "@temporalio/client"

/**
 * Initializes and runs the Temporal scheduler.
 * 
 * This function connects to the Temporal server and creates a schedule for the DSE market scraper.
 * The schedule is configured to run the dseScraperWorkflow every 2 minutes during trading hours
 * (10:00-14:30 Bangladesh time) on weekdays.
 * 
 * If the schedule already exists, it will inform the user how to delete it first.
 * 
 * @returns {Promise<void>} A promise that resolves when the schedule is created successfully or rejects on error
 * 
 * @example
 * // To start the scheduler:
 * // npm run start:scheduler
 * // or in development:
 * // npm run dev:scheduler
 */
async function run() {
  const temporalAddress = process.env.TEMPORAL_ADDRESS || 'temporal:7233';
  console.log(`Connecting to Temporal server at ${temporalAddress}`);

  // Create a connection directly to the service
  const connection = await Connection.connect({
    address: temporalAddress
  });
  
  // Create client with the connection
  const client = new Client({
    connection
  });

  try {
    // Try a simple operation first to test the connection
    console.log("Testing connection to Temporal server...");
    
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
        workflowType: "dseScraperWorkflow",
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
