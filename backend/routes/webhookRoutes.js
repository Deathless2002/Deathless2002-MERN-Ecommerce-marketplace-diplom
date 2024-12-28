const express = require('express');
const router = express.Router();
const stripe = require('../utils/stripeConfig');
const endpointSecret = 'your_webhook_secret_here';

router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
    const sig = req.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const sellerId = paymentIntent.metadata.sellerId;

        console.log(`Payment for seller ${sellerId} succeeded.`);
        //добавить код для обработки успешного платежа
    }

    res.status(200).send();
});

module.exports = router;

