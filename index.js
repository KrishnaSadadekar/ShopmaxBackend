// Import necessary modules
const express = require('express');
const cors = require('cors');
const dotenv = require("dotenv");
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// MongoDB URI from environment variable
const uri = process.env.MONGODB_URI;
console.log('MongoDB URI:', uri); // Check if uri is correctly loaded

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));

// Initialize the Express app
const app = express();

// Middleware setup
app.use(express.json()); // To parse JSON bodies
app.use(cors()); // To enable CORS
app.use(express.urlencoded({ extended: false })); // To parse URL-encoded bodies

// Routes setup
app.use('/api', require("./Routers/CreateUser"));
app.use('/api', require("./Routers/AllProducts"));
app.use('/api', require("./Routers/LoginUser"));
app.use('/api', require("./Routers/CartItem"));
app.use('/api', require("./Routers/Order"));

// Start the server
const PORT = process.env.PORT || 4000;
console.log('Server is running on port:', PORT);
app.listen(PORT, () => console.log(`Server is started on http://localhost:${PORT}`));
