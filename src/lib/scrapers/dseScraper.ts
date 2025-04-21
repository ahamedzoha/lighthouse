import { DSEStockData, ScrapedData } from "../../types"
import puppeteer from "puppeteer"

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
export async function scrapeDSE(): Promise<ScrapedData[]> {
  const url = "https://dsebd.org/latest_share_price_scroll_l.php"

  const browser = await puppeteer.launch({
    headless: true,
    // Add these options to help with reliability
    args: [ '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-crash-reporter',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'],
  })

  try {
    const page = await browser.newPage()

    // Add user agent to avoid blocking
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    )

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000, // Increase timeout
    })

    // Wait for table to load
    await page.waitForSelector("table.table-bordered tr", { timeout: 10000 })

    const stocks = await page.evaluate(() => {
      const rows = document.querySelectorAll("table.table-bordered tr")
      return Array.from(rows)
        .slice(1) // Skip header row
        .map((row) => {
          const cols = Array.from(row.querySelectorAll("td"))
          if (cols.length < 10) return null

          const getText = (col: Element) => col?.textContent?.trim() || ""
          const getNumber = (col: Element) => parseFloat(getText(col)) || 0
          const getInt = (col: Element) =>
            parseInt(getText(col).replace(/,/g, "")) || 0

          return {
            trading_code: getText(cols[1]),
            ltp: getNumber(cols[2]),
            high: getNumber(cols[3]),
            low: getNumber(cols[4]),
            close_price: getNumber(cols[5]),
            ycp: getNumber(cols[6]),
            change: getNumber(cols[7]),
            trade_count: getInt(cols[8]),
            value_mn: getNumber(cols[9]),
            volume: getInt(cols[10]),
          }
        })
        .filter(
          (stock): stock is DSEStockData =>
            stock !== null && stock.trading_code !== ""
        )
    })

    if (!stocks.length) {
      throw new Error("No stock data found")
    }

    return stocks.map((stock) => ({
      time: new Date().toISOString(),
      source: "dse_bd",
      metric_name: stock.trading_code,
      value: stock.ltp,
      metadata: {
        high: stock.high,
        low: stock.low,
        close_price: stock.close_price,
        ycp: stock.ycp,
        change: stock.change,
        trade_count: stock.trade_count,
        value_mn: stock.value_mn,
        volume: stock.volume,
      },
    }))
  } catch (error: unknown) {
    console.error("DSE scraping failed:", error)
    throw new Error(
      `Failed to scrape DSE: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    )
  } finally {
    await browser.close()
  }
}
