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
    'DELETE',
    'PATCH'
  ],

  allowedHeaders: [
    'Content-Type',
    'Authorization',
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
const userInfoRoute = require('./routes/user.info.route');
const cardOrderRoute = require('./routes/card.order.route');
const refreshTokenRoute = require('./routes/refreshToken.route');

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/user-info', userInfoRoute);
app.use('/api/order', cardOrderRoute);
app.use('/api/token', refreshTokenRoute);

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