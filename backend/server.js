import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import productRoutes from './routes/productRoutes.js';
import orderRoutes, { stripeWebhook } from './routes/ordersRoutes.js';

dotenv.config();

const app = express();
connectDB();

app.post(
  '/api/v1/order/webhook',
  express.raw({ type: 'application/json' }),
  stripeWebhook
);

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.use('/api/v1/product', productRoutes);
app.use('/api/v1/order', orderRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
