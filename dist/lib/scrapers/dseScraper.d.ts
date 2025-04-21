import { ScrapedData } from "../../types"
/**
 * Scrapes stock market data from the DSE website.
 *
 * This function uses Puppeteer to load the DSE latest share price page, waits for the
 * stock table to load, and then extracts and parses data from each row. The returned data
 * includes the trading code, last trade price, and other metrics that are stored along with a timestamp.
 *
 * @returns {Promise<ScrapedData[]>} A promise that resolves to an array of scraped data objects.
 *
 * @throws {Error} If the webpage fails to load or no stock data is found.
 *
 * @example
 * (async () => {
 *   try {
 *     const data = await scrapeDSE();
 *     console.log("Scraped data:", data);
 *   } catch (error) {
 *     console.error("Scraping error:", error);
 *   }
 * })();
 */
export declare function scrapeDSE(): Promise<ScrapedData[]>
