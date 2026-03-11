import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useAppSelector } from "../../store";
import PaymentForm from "../../components/checkout/PaymentForm";
import CheckoutSteps from "../../components/commons/CheckoutSteps";
import { useNavigate } from "react-router-dom";

// Initialize Stripe outside of component to avoid recreation
const stripePromise = loadStripe("your_publishable_key_here");

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { clientSecret } = useAppSelector((state) => state.paymentIntent);

  // 1. Create options only if clientSecret exists
  // 2. Use a type cast or a check to satisfy Stripe's strict type
  const options = clientSecret
    ? {
        clientSecret,
        appearance: { theme: "stripe" as const },
      }
    : undefined;

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <CheckoutSteps currentStep={3} />

      <div className="mt-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Complete Payment
        </h1>

        {/* Only render Elements when clientSecret is a truthy string */}
        {clientSecret && options ? (
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm
              onSuccess={(id) => navigate(`/payment-success?order=${id}`)}
            />
          </Elements>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 font-medium">
              Securing your checkout session...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
