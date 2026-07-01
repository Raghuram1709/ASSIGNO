import "./src/config/env.js";

import app from './src/app.js';
import connectDB from './src/config/database.js';


connectDB();


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})