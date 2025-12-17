import express from 'express';
import orderModals from '../modals/orderModals.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();


const createOrder = async (req, res) => {
  try {
    const { paymentStatus, transtionId, email, purchasedItemId } = req.body;

    if (!paymentStatus || !transtionId || !email || !purchasedItemId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const order = await orderModals.create({
      paymentStatus,
      transtionId,
      email,
      purchasedItemId
    });

    res.status(200).json({ message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllOrder = async (req, res) => {
  const orders = await orderModals.find().populate('purchasedItemId');
  res.json({ orders });
};

const getOrderStatusById = async (req, res) => {
  const order = await orderModals.findById(req.params.id).populate('purchasedItemId');
  res.json({ order });
};

router.post('/', createOrder);
router.get('/', getAllOrder);
router.get('/:id', getOrderStatusById);


router.post('/create-checkout-session', async (req, res) => {
  const { items } = req.body;

  const lineItems = items.map(item => ({
    price_data: {
      currency: 'usd',
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity || 1,
  }));

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: lineItems,
    success_url: `${process.env.CLIENT_URL}/success`,
    cancel_url: `${process.env.CLIENT_URL}/cancel`,
    metadata: {
      productIds: items.map(i => i._id).join(','),
      quantities: items.map(i => i.quantity).join(','),
      prices: items.map(i => i.price).join(',')
    }
  });

  res.json({ url: session.url });
});


export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(' Webhook verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(' Webhook verified:', event.type);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const productIds = session.metadata.productIds.split(',');
    const quantities = session.metadata.quantities.split(',');
    const prices = session.metadata.prices.split(',');

    for (let i = 0; i < productIds.length; i++) {
      await orderModals.create({
        paymentStatus: 'success',
        transtionId: session.payment_intent,
        email: session.customer_details.email,
        purchasedItemId: productIds[i],
        quantity: quantities[i],
        amount: prices[i] * quantities[i]
      });
    }

    console.log(' Orders saved successfully');
  }

  res.json({ received: true });
};

export default router;
