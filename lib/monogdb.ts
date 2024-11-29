// COPIED THIS COMPONENT FROM ONLINE
import { MongoClient, Db } from 'mongodb';

const uri = process.env.NEXT_PUBLIC_MONGO_URI as string | null; // Ensure this is set in your .env
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let db: Db | null = null;

declare global {
	var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!uri) {
	throw new Error('Please add your MongoDB URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
	// In development mode, reuse the global promise to avoid multiple connections
	if (!global._mongoClientPromise) {
		client = new MongoClient(uri, options);
		global._mongoClientPromise = client.connect();
	}
	clientPromise = global._mongoClientPromise;
} else {
	// In production mode, create a new client
	client = new MongoClient(uri, options);
	clientPromise = client.connect();
}

async function dbPromise() {
    if (!db)
        db = (await clientPromise).db("one-note");
    return db;
}

export { dbPromise };
