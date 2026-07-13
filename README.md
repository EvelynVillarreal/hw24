# Real-Time IoT Sensor Data Processor

This project demonstrates Asynchronous Data Streams in Node.js using TypeScript. 

It covers two main aspects of Asynchronous Streams:
1. **Data Simulation (`async function*`)**: Generating data locally as an asynchronous stream.
2. **Database Streaming (`pg-query-stream`)**: Fetching huge tables from PostgreSQL without blowing up the Node.js memory.
3. **Consumer (`for await...of`)**: Consuming streams properly with back-pressure handling.

## Running the Code

1. Initialize dependencies:
   ```bash
   npm install
   ```

2. Run the application in development mode:
   ```bash
   npm run dev
   ```

## Setting up PostgreSQL (Supabase / Neon)

To run the database streaming example:
1. Create a PostgreSQL database on [Supabase](https://supabase.com/) or [Neon](https://neon.tech/).
2. Run the SQL schema found in `src/schema.sql` in your database.
3. Create a `.env` file in the root of this project and add your connection string:
   ```
   DATABASE_URL=postgres://user:password@host:port/dbname
   ```
4. Seed the database with mock data:
   ```bash
   npm run seed
   ```
5. Run the application in development mode:
   ```bash
   npm run dev
   ```
   The application will detect the `DATABASE_URL` and stream the 5,000 rows out of the `sensor_readings` table sequentially without overloading memory.

6. (Optional) Compile and run for production:
   ```bash
   npm run build
   npm start
   ```
## Why Async Iterators over Arrays?

In typical operations, developers might query a database or process data by returning an array (`const data = await db.query()`). For IoT data, which is continuous and huge, an array has critical flaws:
- **Memory Bloat (OOM)**: Loading millions of rows at once into memory will crash a Node.js process (Out Of Memory).
- **Latency**: The consumer must wait for the *entire* array to finish downloading before it can begin processing the first row.

**Async Generators (`async function*`) and Iterators (`for await...of`)** solve this:
- Data is processed row by row, or chunk by chunk.
- **Back-pressure**: The producer pauses until the consumer finishes processing the current row.
- **Low Memory Footprint**: Only a single row (or small batch) exists in memory at any given time.
