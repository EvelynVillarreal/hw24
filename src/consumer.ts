export interface SensorReading {
    sensorName: string;
    value: number;
    timestamp: Date;
}

/**
 * Asynchronous Stream Consumer
 * 
 * We use `for await...of` to iterate over the async generator.
 * This naturally applies back-pressure: the consumer will wait for the next
 * item to be yielded, and the generator won't produce the next item until
 * the consumer asks for it (or until it's ready, depending on the buffer strategy).
 * 
 * Contrast this with `array.forEach()` or `array.map()` where the entire dataset 
 * must be in memory before processing begins, potentially causing Out-Of-Memory (OOM) errors.
 */
export async function processSensorData(stream: AsyncIterable<SensorReading>) {
    console.log("Starting stream processing...");
    
    let processedCount = 0;

    try {
        for await (const reading of stream) {
            // Filtering: Only process critical readings (value > 80)
            if (reading.value > 80) {
                console.log(`[CRITICAL] High value detected: ${reading.sensorName} - ${reading.value} at ${reading.timestamp.toISOString()}`);
                
                // Simulate some asynchronous processing overhead (e.g., sending an alert, writing to DB)
                await new Promise(resolve => setTimeout(resolve, 50));
            }
            
            processedCount++;
            if (processedCount % 10 === 0) {
                console.log(`Processed ${processedCount} readings so far...`);
            }
        }
    } catch (error) {
        console.error("Error while processing stream:", error);
    } finally {
        console.log(`Stream processing completed. Total processed: ${processedCount}`);
    }
}
