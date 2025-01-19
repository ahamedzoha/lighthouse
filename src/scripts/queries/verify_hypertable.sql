-- Check if scraped_data is a hypertable
SELECT * FROM timescaledb_information.hypertables 
WHERE hypertable_name = 'scraped_data';

-- Check chunk information
SELECT chunk_name, range_start, range_end 
FROM timescaledb_information.chunks 
WHERE hypertable_name = 'scraped_data'; 