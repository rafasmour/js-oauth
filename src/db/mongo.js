import mongoose from "mongoose";
import { MONGO_DB_NAME } from "../vars/app.constants";
const mongoConnect = async () => {
    try {
        const URI = `${process.env.MONGODB_URI}/${MONGO_DB_NAME}`;
        const conn = await mongoose.connect(`${URI}`);
        console.log(`Successful connection to MongoDB: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error connecting to MongoDB: ${error}`);
        process.exit(1);
    }
}

export { mongoConnect };