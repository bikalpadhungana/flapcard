const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

require('dotenv').config();

// express app
const app = express();

const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
    'Set-Cookie',
  ],
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOpts));

// environment variables
const port = process.env.PORT;

// routes
const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

// error handling middleware
app.use((error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});