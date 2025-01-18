import { DSEStockData, DSEScrapeResult, ScrapedData } from "../../types"
import puppeteer from "puppeteer"

export async function scrapeDSE(): Promise<ScrapedData[]> {
  const url = "https://dsebd.org/latest_share_price_scroll_l.php"

  const browser = await puppeteer.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 30000,
    })

    await page.waitForSelector("table tr", { timeout: 5000 })

    const stocks = await page.evaluate(() => {
      const rows = document.querySelectorAll("table tr")
      return Array.from(rows)
        .slice(1) // Skip header
        .map((row) => {
          const cols = row.querySelectorAll("td")
          if (cols.length < 10) return null

          return {
            trading_code: cols[1]?.textContent?.trim() || "",
            ltp: parseFloat(cols[2]?.textContent?.trim() || "0"),
            high: parseFloat(cols[3]?.textContent?.trim() || "0"),
            low: parseFloat(cols[4]?.textContent?.trim() || "0"),
            close_price: parseFloat(cols[5]?.textContent?.trim() || "0"),
            ycp: parseFloat(cols[6]?.textContent?.trim() || "0"),
            change: parseFloat(cols[7]?.textContent?.trim() || "0"),
            trade_count: parseInt(cols[8]?.textContent?.trim() || "0"),
            value_mn: parseFloat(cols[9]?.textContent?.trim() || "0"),
            volume: parseInt(
              (cols[10]?.textContent?.trim() || "0").replace(/,/g, "")
            ),
          }
        })
        .filter((stock): stock is DSEStockData => stock !== null)
    })

    return stocks.map((stock) => ({
      time: new Date(),
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
