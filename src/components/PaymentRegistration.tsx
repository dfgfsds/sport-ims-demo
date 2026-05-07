import React, { useState } from 'react';
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { RegistrationData } from '../types';
import { submitRegistration } from '../services/api';

interface PaymentRegistrationProps {
  registrationData: RegistrationData;
  eventFee: number;
  onSuccess: (registrationId: string) => void;
}

export const PaymentRegistration: React.FC<PaymentRegistrationProps> = ({
  registrationData,
  eventFee,
  onSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const paymentId = 'PAY' + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      const registrationPayload = {
        ...registrationData,
        paymentId,
        amountPaid: eventFee
      };

      const result = await submitRegistration(registrationPayload);
      
      if (result.success && result.registrationId) {
        onSuccess(result.registrationId);
      } else {
        throw new Error('Registration failed');
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CreditCard className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment & Registration</h2>
        <p className="text-gray-600">Complete your payment to confirm registration</p>
      </div>

      {/* Registration Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Registration Summary</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-blue-700">Player Name:</span>
            <span className="text-blue-600 font-medium">{registrationData.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Skate Category:</span>
            <span className="text-blue-600 font-medium capitalize">{registrationData.skateCategory}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-blue-700">Selected Races:</span>
            <span className="text-blue-600 font-medium">{registrationData.selectedRacesIds.length} races</span>
          </div>
          <div className="border-t border-blue-200 pt-3 mt-3">
            <div className="flex justify-between text-lg font-semibold">
              <span className="text-blue-900">Total Amount:</span>
              <span className="text-blue-600">₹{eventFee}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handlePaymentSubmit} className="space-y-6">
        {/* Payment Method Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('upi')}
              className={`p-4 border-2 rounded-lg transition-all ${
                paymentMethod === 'upi'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">📱</div>
                <p className="font-medium">UPI Payment</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 border-2 rounded-lg transition-all ${
                paymentMethod === 'card'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-green-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-2">💳</div>
                <p className="font-medium">Credit/Debit Card</p>
              </div>
            </button>
          </div>
        </div>

        {/* Payment Details */}
        {paymentMethod === 'upi' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              UPI ID
            </label>
            <input
              type="text"
              name="upiId"
              value={paymentDetails.upiId}
              onChange={handleInputChange}
              placeholder="Enter your UPI ID"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              required
            />
          </div>
        )}

        {paymentMethod === 'card' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                name="cardNumber"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  name="expiryDate"
                  value={paymentDetails.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  name="cvv"
                  value={paymentDetails.cvv}
                  onChange={handleInputChange}
                  placeholder="123"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                name="cardName"
                value={paymentDetails.cardName}
                onChange={handleInputChange}
                placeholder="Name on card"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                required
              />
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center text-lg font-semibold"
        >
          {loading ? (
            <>
              <Loader2 className="w-6 h-6 mr-3 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-6 h-6 mr-3" />
              Pay ₹{eventFee} & Register
            </>
          )}
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-500">
          🔒 Your payment information is secure and encrypted
        </p>
      </div>
    </div>
  );
};