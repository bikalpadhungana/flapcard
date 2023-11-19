const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

require('dotenv').config();

// express app
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// environment variables
const mongoUri = process.env.MONGO_URI;
const port = process.env.PORT;

// routes
const authRoute = require('./routes/auth.route');

app.use("/api/auth", authRoute);

mongoose.connect(mongoUri)
    .then(() => {
        console.log("Connected to database");

        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        })
    })
    .catch((error) => {
        console.error(error);
    });