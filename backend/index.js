import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/dbConnect.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

const app = express();

// ✅ Add middleware to parse JSON and URL-encoded data
app.use(express.json());  // Parses incoming JSON payloads
app.use(express.urlencoded({ extended: true }));  // Parses URL-encoded data

// Test route
app.get("/", (req, res) => {
    res.send("Hii welcome to the authentication class!!");
});

// Authentication routes
app.use('/api/auth', authRoutes);

// Start the server
app.listen(3000, () => {
    connectDB();
    console.log("The server is running smoothly!!");
});
