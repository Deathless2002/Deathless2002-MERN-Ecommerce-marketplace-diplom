import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const stripePromise = loadStripe('pk_live_51PCn6p2KYIyQe4NKgGaCzlux7nSu6uZDPfrQgwcZPaKfsu9dwHVKGDCAV8mgPOLZbHdgXK3qf3jmkQ2KqEd76mdr00UXpQw79w');

const CheckoutForm = ({ amount, currency, sellerId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [succeeded, setSucceeded] = useState(false);
    const [clientSecret, setClientSecret] = useState('');

    useEffect(() => {
        axios.post('/api/payment/create-payment-intent', {
            amount: amount,
            currency: currency,
            sellerId: sellerId,
        }).then(response => {
            setClientSecret(response.data.clientSecret);
        });
    }, [amount, currency, sellerId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            }
        });

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button disabled={processing || succeeded}>
                {processing ? "Processing..." : "Pay"}
            </button>
            {error && <div>{error}</div>}
        </form>
    );
};

const Checkout = ({ amount, currency, sellerId }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutForm amount={amount} currency={currency} sellerId={sellerId} />
        </Elements>
    );
};

export default Checkout;
