/**
 * Represents a generic piece of scraped data.
 * 
 * This is the core data structure used throughout the application for storing
 * time-series data from various sources.
 */
export interface ScrapedData {
  /** Timestamp when the data was recorded. Can be a Date object or a string that can be parsed to Date */
  time: Date | string
  /** The source of the data (e.g., "dse", "nyse", etc.) */
  source: string
  /** The name of the metric being measured (e.g., "index", "stock_price") */
  metric_name: string
  /** The numerical value of the metric */
  value: number
  /** Additional information related to the scraped data */
  metadata: Record<string, unknown>
}

/**
 * Represents DSE (Dhaka Stock Exchange) specific stock data.
 * 
 * Contains all relevant trading information for a single stock.
 */
export interface DSEStockData {
  /** Trading code/symbol of the stock */
  trading_code: string
  /** Last Trade Price */
  ltp: number
  /** Highest price of the day */
  high: number
  /** Lowest price of the day */
  low: number
  /** Closing price */
  close_price: number
  /** Yesterday's Closing Price */
  ycp: number
  /** Change in price (usually from previous closing) */
  change: number
  /** Number of trades executed */
  trade_count: number
  /** Total value traded in millions */
  value_mn: number
  /** Total volume (number of shares) traded */
  volume: number
}

/**
 * Represents the result of a DSE scraping operation.
 * 
 * Contains metadata about the scrape and the collected stock data.
 */
export interface DSEScrapeResult {
  /** Timestamp when the data was scraped */
  time: Date
  /** Data source identifier */
  source: string
  /** Array of stock data for all scraped symbols */
  data: DSEStockData[]
}
