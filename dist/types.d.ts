export interface ScrapedData {
    time: Date | string;
    source: string;
    metric_name: string;
    value: number;
    metadata: Record<string, unknown>;
}
export interface DSEStockData {
    trading_code: string;
    ltp: number;
    high: number;
    low: number;
    close_price: number;
    ycp: number;
    change: number;
    trade_count: number;
    value_mn: number;
    volume: number;
}
export interface DSEScrapeResult {
    time: Date;
    source: string;
    data: DSEStockData[];
}
