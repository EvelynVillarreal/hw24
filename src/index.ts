import 'dotenv/config'; // Load environment variables from .env file FIRST
import { processSensorData } from './consumer.js';
import { getDatabaseStream, closeDb } from './db.js';

async function main() {
    console.log("============================================");
    console.log("    Real-Time IoT Sensor Data Processor     ");
    console.log("============================================\n");

    if (process.env.DATABASE_URL) {
        console.log("DATABASE_URL found. Running PostgreSQL stream example...");
        const dbStream = getDatabaseStream();
        await processSensorData(dbStream);
        await closeDb();
    } else {
        console.log("[INFO] Skipping Database Stream because DATABASE_URL is not set in .env.");
    }
}

main().catch(err => {
    console.error("Application error:", err);
    process.exit(1);
});
