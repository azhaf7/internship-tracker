import 'dotenv/config';
import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';

const PORT = process.env.PORT ?? 5050;

async function start() {
  try {
    const connection = await connectDatabase();
    console.log(`Connected to MongoDB: ${connection.name}`);

    createApp().listen(PORT, () => {
      console.log(`API listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
}

start();
