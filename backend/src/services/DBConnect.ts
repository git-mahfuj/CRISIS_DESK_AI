import mongoose from "mongoose";



const connectDB = async (): Promise<void> => {
    try {
        const MONGOURI = process.env.MONGO_URI;
        if (!MONGOURI) {
            throw new Error("MONGO_URI is not defined in environment variables!");

        }

        if (mongoose.connection.readyState >= 1) {
            console.log("MongoDB Already Connected")
            return;
        }

        const conn = await mongoose.connect(MONGOURI as string)

        console.log(`MONGODB Connected : ${conn.connection.host}`)

    } catch (error) {
        if (error instanceof Error) {
            console.error(`MongoDB Connect Error : ${error.message}`)
        } else {
            console.error("MongoDB Connect Error", error)
        }

        process.exit(1)
    }
}

process.on('SIGINT', async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection disconnected app termination");
    process.exit(0)
})


export { connectDB }