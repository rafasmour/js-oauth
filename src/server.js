import dotenv from "dotenv";
import { app } from "./app.js";
import { mongoConnect } from "./db/mongo.js";

const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN
connectDB
    .then(() => {
        console.log("Connected to MongoDB");
        // domain is the traefik entry url
        app.listen(PORT, () => {
            console.log(`Api is working on endpoint ${DOMAIN}`);
        })
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    });