import { app } from "./app.js";
import { mongoConnect } from "./db/mongo.js";
import env from "./vars/env.js";


const PORT = env.PORT || 3000;
console.log(env.PORT)
mongoConnect()
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Api is working on endpoint ${PORT}`);
        })
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB", error);
        process.exit(1);
    });