import { proxyActivities, sleep } from "@temporalio/workflow"
import { Activities } from "../activities"

const { scrapeDSE } = proxyActivities<Activities>({
  startToCloseTimeout: "2 minutes",
  retry: {
    maximumAttempts: 3,
    initialInterval: "10 seconds",
  },
})

export async function dseScraperWorkflow(): Promise<void> {
  // Check trading hours
  const now = new Date()
  const hour = now.getHours()
  const minute = now.getMinutes()

  if (hour === 14 && minute > 30) {
    console.log("Outside trading hours, skipping")
    await sleep("1 hour")
    return
  }

  await scrapeDSE()
}
