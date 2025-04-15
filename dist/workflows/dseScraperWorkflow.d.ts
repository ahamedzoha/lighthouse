/**
 * Workflow for scraping DSE stock data.
 *
 * This workflow is executed by the Temporal worker. It performs a simple trading hours check,
 * and if within trading hours (10:00–14:00), it executes the following activities sequentially:
 * 1. Scrape the data.
 * 2. Validate the scraped data using Zod.
 * 3. Insert the validated data into the database.
 *
 * @example
 * // This workflow is usually scheduled by Temporal and executed by a worker.
 * await dseScraperWorkflow();
 * await dseScraperWorkflow(true); // Bypass trading hours check
 *
 * @param bypassTradingHoursCheck - Optional flag to bypass trading hours check
 */
export declare function dseScraperWorkflow(bypassTradingHoursCheck?: boolean): Promise<void>;
