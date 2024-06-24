const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const userRouter = require('./routers/userRouter');
const seedRouter = require('./routers/seedRouter');
const { errorResponse } = require('./controllers/responseControllers');
const authRouter = require('./routers/auth');
const productRouter = require('./routers/productsRouter');
const payoutsRouter = require('./routers/payoutsRouter');
const contactRouter = require('./routers/contactRouter');

//
const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100,

  message: 'too many requests from this IP . Please try again .',
});

app.use(cookieParser());
app.use(rateLimiter);

app.use(xssClean());
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/seed', seedRouter);
app.use('/api/auth', authRouter);
app.use('/api/products', productRouter);
app.use('/api/payouts', payoutsRouter);
app.use('/api/contact', contactRouter);

app.get('/test', (req, res) => {
  res.status(200).send({
    message: 'api testing is working fine',
  });
});

// clint handing error
app.use((req, res, next) => {
  next(createError(404, 'route not found'));
});

// server handing error
app.use((err, req, res, next) => {
  return errorResponse(res, {
    statusCode: err.status,
    message: err.message,
  });
});

module.exports = app;
