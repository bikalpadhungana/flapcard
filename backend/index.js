const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

require('dotenv').config();

const app = express();

const corsOpts = {
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOpts));
app.use(fileUpload()); // Add this for file uploads
app.use('/uploads', express.static('public/uploads')); // Serve uploaded files

const port = process.env.PORT;

const authRoute = require('./routes/auth.route');
const userRoute = require('./routes/user.route');
const userInfoRoute = require('./routes/user.info.route');
const cardOrderRoute = require('./routes/card.order.route');
const refreshTokenRoute = require('./routes/refreshToken.route');
const messageRouter = require('./routes/message.route');
const dotsRoute = require('./routes/dots.route'); // New route

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/user-info', userInfoRoute);
app.use('/api/order', cardOrderRoute);
app.use('/api/token', refreshTokenRoute);
app.use('/api/messages', messageRouter);
app.use('/api', dotsRoute); // Mount dots route under /api

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