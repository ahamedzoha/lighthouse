export interface ScrapedData {
  time: Date | string // Allow both Date and string
  source: string
  metric_name: string
  value: number
  metadata: Record<string, unknown>
}

export interface DSEStockData {
  trading_code: string
  ltp: number // Last Trade Price
  high: number
  low: number
  close_price: number
  ycp: number // Yesterday's Closing Price
  change: number
  trade_count: number
  value_mn: number // Value in millions
  volume: number
}

export interface DSEScrapeResult {
  time: Date
  source: string
  data: DSEStockData[]
}
