import { ScrapedData } from "../types"
export declare const activities: {
  /**
   * Activity to perform the scraping.
   *
   * @returns {Promise<ScrapedData[]>} The raw scraped data.
   *
   * @example
   * const rawData = await activities.scrapeActivity();
   */
  scrapeActivity: () => Promise<ScrapedData[]>
  /**
   * Activity to validate the raw scraped data using Zod.
   *
   * @param {unknown[]} data - The raw scraped data.
   * @returns {ScrapedData[]} The validated scraped data.
   *
   * @throws {Error} If validation fails.
   *
   * @example
   * const validatedData = await activities.validateActivity(rawData);
   */
  validateActivity: (data: unknown[]) => Promise<ScrapedData[]>
  /**
   * Activity to insert validated data into the database.
   *
   * @param {ScrapedData[]} data - The validated scraped data.
   * @returns {Promise<void>}
   *
   * @example
   * await activities.insertDbActivity(validatedData);
   */
  insertDbActivity: (data: ScrapedData[]) => Promise<void>
}
export type Activities = typeof activities
