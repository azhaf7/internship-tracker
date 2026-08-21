import mongoose from 'mongoose';

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      'MONGODB_URI is missing. Copy server/.env.example to server/.env and add your Atlas connection string.'
    );
  }

  mongoose.set('strictQuery', true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });

  return mongoose.connection;
}

export async function disconnectDatabase() {
  await mongoose.connection.close();
}
