const express = require('express');
const router = express.Router();
const stripe = require('../utils/stripeConfig');

router.post('/create-payment-intent', async (req, res) => {
    const { amount, currency, sellerId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            metadata: { sellerId: sellerId },
        });

        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({
            error: error.message,
        });
    }
});

module.exports = router;
