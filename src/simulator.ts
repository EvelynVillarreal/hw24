/**
 * Data Simulation using Async Generators.
 * 
 * Async generators (async function*) are perfect for modeling continuous streams of data
 * such as IoT sensor readings. They yield data chunks asynchronously, allowing the 
 * consumer to process them one by one. This prevents memory bloat because the data
 * is generated on-demand rather than allocating a massive array in memory.
 */

export interface SensorReading {
    sensorName: string;
    value: number;
    timestamp: Date;
}

export async function* simulateSensorDataStream(
    count: number = Infinity, 
    delayMs: number = 100
): AsyncGenerator<SensorReading, void, unknown> {
    let i = 0;
    while (i < count) {
        // Simulate a small delay for data transmission
        await new Promise(resolve => setTimeout(resolve, delayMs));

        const reading: SensorReading = {
            sensorName: `Sensor-${Math.floor(Math.random() * 5) + 1}`,
            value: Number((Math.random() * 100).toFixed(2)),
            timestamp: new Date()
        };

        // Yield the reading to the consumer. Memory footprint remains small 
        // because we don't accumulate readings in an array.
        yield reading;
        i++;
    }
}
