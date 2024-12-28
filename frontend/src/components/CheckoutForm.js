import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CheckoutForm = ({ amount, currency, sellerId }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setProcessing(true);

        const { error: backendError, clientSecret } = await fetch('/api/payment/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ amount, currency, sellerId }),
        }).then(res => res.json());

        if (backendError) {
            setError(backendError.message);
            setProcessing(false);
            return;
        }

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
            },
        });

        if (stripeError) {
            setError(stripeError.message);
            setProcessing(false);
            return;
        }

        setSuccess(true);
        setProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button disabled={processing || !stripe}>
                {processing ? "Processing..." : "Pay"}
            </button>
            {error && <div>{error}</div>}
            {success && <div>Payment Successful!</div>}
        </form>
    );
};

export default CheckoutForm;
