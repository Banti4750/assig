import express from 'express';
import orderModals from '../modals/orderModals.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();



const getAllOrder = async (req, res) => {
  const orders = await orderModals.find().populate('purchasedItemId');
  res.json({ orders });
};

const getOrderStatusById = async (req, res) => {
  const order = await orderModals.findById(req.params.id).populate('purchasedItemId');
  res.json({ order });
};

router.get('/', getAllOrder);
router.get('/:id', getOrderStatusById);


router.post('/create-pending-order', async (req, res) => {
  try {
    const { email, items } = req.body;

    if (!email || !items || items.length === 0) {
      return res.status(400).json({ message: 'Email and items are required' });
    }

    const createdOrders = [];
    for (const item of items) {
      const pendingOrder = await orderModals.create({
        paymentStatus: 'pending',
        transtionId: `pending_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        purchasedItemId: item._id,
        quantity: item.quantity || 1,
        amount: item.price * (item.quantity || 1),
        sessionId: null
      });
      createdOrders.push(pendingOrder);
    }

    res.status(200).json({
      message: 'Pending orders created',
      orders: createdOrders,
      orderIds: createdOrders.map(order => order._id)
    });
  } catch (error) {
    console.error('Error creating pending order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { items, customerEmail, orderIds } = req.body;

    if (!customerEmail || !items || !orderIds) {
      return res.status(400).json({ message: 'Email, items, and order IDs are required' });
    }

    const lineItems = items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.title || item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity || 1,
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: customerEmail,
      success_url: `${process.env.CLIENT_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      metadata: {
        orderIds: orderIds.join(','),
        productIds: items.map(i => i._id).join(','),
        quantities: items.map(i => i.quantity || 1).join(','),
        prices: items.map(i => i.price).join(',')
      }
    });

    await orderModals.updateMany(
      { _id: { $in: orderIds } },
      { $set: { sessionId: session.id } }
    );

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: 'Error creating checkout session' });
  }
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

    const orderIds = session.metadata.orderIds.split(',');

    for (let i = 0; i < orderIds.length; i++) {
      await orderModals.findByIdAndUpdate(
        orderIds[i],
        {
          paymentStatus: 'success',
          transtionId: `${session.payment_intent}_order${i}`,
          amount: session.amount_total / 100 / orderIds.length
        }
      );
    }

    console.log(`Updated ${orderIds.length} orders to success status`);
  }

  res.json({ received: true });
};

export default router;
