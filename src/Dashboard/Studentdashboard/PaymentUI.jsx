import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useParams, useNavigate } from "react-router";
import { toast } from "react-toastify";
import api from "../../services/api";
import logo from '../../assets/Group (11).png'
import logo1 from '../../assets/Group (21).png'
import logo2 from '../../assets/Layer_1.png'
import logo3 from '../../assets/card1.png'
import logo4 from '../../assets/card2.png'
import logo5 from '../../assets/card3.png'

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Payment form component that uses Stripe hooks
function PaymentForm() {
  const { bookingId, amount } = useParams();
  const navigate = useNavigate();
  const [selected, setSelected] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  
  // Get bookingId and amount from URL params
  const paymentAmount = parseFloat(amount) || 45.00;

  const methods = [
    { id: "card", label: "Card", img: logo2, },
    {
      id: "ideal",
      label: "iDEAL",
      img: logo,
    },
    {
      id: "bancontact",
      label: "bancontact",
      img: logo1,
    },
  ];

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    if (!bookingId) {
      setError("Missing booking information");
      toast.error("Missing booking information");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create payment method using Stripe Elements
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message);
        toast.error(paymentMethodError.message);
        return;
      }

      // Call backend API to process payment using the booking payment endpoint
      // Based on Postman collection: POST /booking/:bookingId/payment
      const response = await api.post(`/booking/${bookingId}/payment`, {
        paymentMethodId: paymentMethod.id,
        amount: Math.round(paymentAmount * 100), // Convert to cents for Stripe
      });

      if (response.status === 200) {
        // Handle successful payment
        toast.success("Payment successful!");
        // Redirect to lessons page after successful payment
        navigate('/dashboard/myLessonspage');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Payment failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingId) {
    return (
      <div className="min-h-screen flex items-center justify-center p-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Missing Booking Information</h2>
          <p className="text-gray-600">Please provide a booking ID to proceed with payment.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Payment
            </h2>
            <p className="text-gray-500 text-sm">
              Secure payment processing via Stripe
            </p>
          </div>

          {/* Payment Methods */}
          <div className="flex gap-4 justify-center">
            {methods.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelected(m.id)}
                className={`
                  flex flex-col items-center cursor-pointer border rounded-xl px-8 py-4
                  transition-all duration-200 
                  ${selected === m.id ? "border-[#7A3AEC] bg-[#F8F4FF]" : "border-gray-300 bg-[#F7F7F7]"}
                `}
              >
                {m.icon ? (
                  <div className="text-[#7A3AEC]">{m.icon}</div>
                ) : (
                  <img src={m.img} className="w-10 h-10 object-contain" />
                )}
                <p
                  className={`mt-2 font-medium ${selected === m.id ? "text-[#7A3AEC]" : "text-gray-600"
                    }`}
                >
                  {m.label}
                </p>
              </div>
            ))}
          </div>

          {/* Stripe Card Element */}
          <div className="space-y-2">
            <label className="text-gray-700 text-sm font-medium">Card Information</label>
            <div className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50/50">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Pay Button */}
          <button
            type="submit"
            disabled={!stripe || loading}
            className="
              w-full py-4 text-white font-semibold rounded-xl 
              bg-gradient-to-r from-[#6657E2] to-[#903CD1]
              hover:shadow-lg hover:shadow-purple-500/25 active:scale-[0.98]
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200
            "
          >
            {loading ? `Processing $${paymentAmount.toFixed(2)}...` : `Pay $${paymentAmount.toFixed(2)}`}
          </button>
        </div>
      </div>
    </form>
  );
}

// Main component that wraps with Stripe Elements
export default function PaymentUI() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}
