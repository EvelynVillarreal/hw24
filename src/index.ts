import 'dotenv/config'; // Load environment variables from .env file FIRST
import { simulateSensorDataStream } from './simulator.js';
import { processSensorData } from './consumer.js';
import { processHistoricalData, closeDb } from './db.js';

async function main() {
    console.log("============================================");
    console.log("    Real-Time IoT Sensor Data Processor     ");
    console.log("============================================\n");

    // 1. Database Integration (Streaming Out)
    if (process.env.DATABASE_URL) {
        console.log("DATABASE_URL found. Running PostgreSQL stream example...");
        await processHistoricalData();
    } else {
        console.log("[INFO] Skipping Database Stream because DATABASE_URL is not set in .env.");
        console.log("To run the DB portion, set up Supabase/Neon and add DATABASE_URL to a .env file.\n");
    }

    // console.log("--- Starting Live Data Simulation ---");

    // 2. Data Simulation (Async Generator)
    // Simulating 50 items with 100ms delay between them
    // const dataStream = simulateSensorDataStream(50, 100);

    // 3. Asynchronous Stream Consumer (for await...of)
    // await processSensorData(dataStream);

    if (process.env.DATABASE_URL) {
        await closeDb();
    }
}

main().catch(err => {
    console.error("Application error:", err);
    process.exit(1);
});
