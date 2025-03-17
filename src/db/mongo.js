import mongoose from "mongoose";
import env from "../vars/env.js";
const mongoConnect = async () => {
    try {
        const URI = `${env.MONGODB_URI}}`;
        const conn = await mongoose.connect(`${URI}`);
        console.log(`Successful connection to MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
}

export { mongoConnect };