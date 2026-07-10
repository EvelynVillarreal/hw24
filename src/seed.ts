import 'dotenv/config';
import { insertMockReading, closeDb } from './db.js';

async function seed() {
    console.log("Seeding database with 5000 mock IoT sensor readings...");
    
    for (let i = 0; i < 5000; i++) {
        const sensorName = `Sensor-${Math.floor(Math.random() * 5) + 1}`;
        const value = Number((Math.random() * 100).toFixed(2));
        
        await insertMockReading(sensorName, value);
        
        if ((i + 1) % 500 === 0) {
            console.log(`Inserted ${i + 1} readings...`);
        }
    }
    
    console.log("Database seeded successfully!");
    await closeDb();
}

seed().catch(err => {
    console.error("Failed to seed database:", err);
    process.exit(1);
});
