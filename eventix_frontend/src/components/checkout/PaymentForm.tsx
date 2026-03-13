import React, { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import Button from '../commons/Button';
import Alert from '../commons/Alert';
import paymentIntentService from '../../service/paymentIntentService';

interface PaymentFormProps {
  reservationId: string;
  onSuccess: (orderId: string) => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ reservationId, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setErrorMessage(null);

    // Confirm the payment with Stripe
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Stripe will redirect here if the payment requires 3D Secure
        return_url: `${window.location.origin}/payment-success`,
      },
      redirect: 'if_required', 
    });

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsProcessing(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      try {
        // Payment successful with Stripe, now confirm with our backend to fulfill order
        const order = await paymentIntentService.confirmPayment({
          paymentIntentId: paymentIntent.id,
          reservationId
        });
        
        // Pass the actual database order ID to the success handler
        onSuccess(order.orderId);
      } catch (err: any) {
        setErrorMessage(err.response?.data?.message || "Payment succeeded but order fulfillment failed. Please contact support.");
        setIsProcessing(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
        <PaymentElement />
      </div>

      {errorMessage && <Alert type="error" message={errorMessage} />}

      <Button
        type="submit"
        variant="primary"
        className="w-full py-4 text-lg font-bold"
        isLoading={isProcessing}
        disabled={!stripe || isProcessing}
      >
        Pay Now
      </Button>
      
      <p className="text-center text-xs text-gray-400">
        Your payment is secured by SSL encryption and processed by Stripe.
      </p>
    </form>
  );
};

export default PaymentForm;