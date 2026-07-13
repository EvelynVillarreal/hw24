import { Pool } from 'pg';
import QueryStream from 'pg-query-stream';

/**
 * Database Integration using Supabase / Neon PostgreSQL Client.
 * 
 * We use `pg-query-stream` to read data directly from PostgreSQL as an Async Iterator.
 * This reads the database cursor in chunks rather than fetching all rows at once into memory,
 * which is essential for processing large datasets (e.g., millions of IoT sensor records).
 */

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Note: Provide your Supabase/Neon connection string in a .env file
});

import type { SensorReading } from './consumer.js';

export async function* getDatabaseStream(): AsyncGenerator<SensorReading> {
    const client = await pool.connect();
    
    try {
        // QueryStream creates an async iterable stream out of a DB query
        const query = new QueryStream('SELECT * FROM sensor_readings ORDER BY timestamp DESC');
        const stream = client.query(query);
        
        console.log("Streaming historical data from PostgreSQL...");
        
        // We can consume the DB stream and yield mapped readings
        for await (const row of stream) {
            yield {
                sensorName: row.sensor_name,
                value: row.value,
                timestamp: row.timestamp
            };
        }
    } catch (error) {
        console.error("Error streaming historical data:", error);
    } finally {
        client.release();
    }
}

export async function insertMockReading(sensorName: string, value: number) {
    await pool.query(
        'INSERT INTO sensor_readings (sensor_name, value) VALUES ($1, $2)',
        [sensorName, value]
    );
}

// Clean up DB pool on exit
export async function closeDb() {
    await pool.end();
}
