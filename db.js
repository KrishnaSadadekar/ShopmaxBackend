const mongoose = require('mongoose');
const MONGODB_URI = "mongodb+srv://krushna1994:DaughterD3@cluster0.fiigtnr.mongodb.net/shopmax?retryWrites=true&w=majority&appName=Cluster0";
const mongoDB = async() => {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Failed to connect to MongoDB', err));

}

module.exports  = mongoDB;

