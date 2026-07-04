import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MOngoDB Connected");

        // Clean up legacy googleId unique index if it exists
        try {
            const db = mongoose.connection.db;
            const collections = await db.listCollections({ name: 'users' }).toArray();
            if (collections.length > 0) {
                const indexes = await db.collection('users').indexes();
                const hasGoogleIdIndex = indexes.some(idx => idx.name === 'googleId_1');
                if (hasGoogleIdIndex) {
                    await db.collection('users').dropIndex('googleId_1');
                    console.log("Successfully dropped legacy googleId_1 unique index");
                }
            }
        } catch (idxError) {
            console.error("Warning: Could not drop legacy googleId_1 index:", idxError.message);
        }
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
}


export default connectDB;