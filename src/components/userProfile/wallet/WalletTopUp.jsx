import React, { useState, useEffect } from 'react';
import { ArrowLeft, Wallet, CreditCard, Smartphone, Building2, Check, AlertCircle, Loader2, X } from 'lucide-react';
import { initiateWalletTopUp, verifyAndCreditWallet, getWalletBalance } from '../../../apis/walletApi'; 

const WalletTopUp = () => {
  const [balance, setBalance] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedPayment, setSelectedPayment] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(true);
  const [step, setStep] = useState('amount'); // 'amount', 'payment', 'processing', 'success'
  const [transactionId, setTransactionId] = useState('');
  const [error, setError] = useState(null);
  const [isBalanceFocused, setIsBalanceFocused] = useState(false);

  const quickAmounts = [500, 1000, 2000];

  const paymentMethods = [
    { id: 'upi', name: 'UPI', icon: Smartphone, desc: 'Pay using any UPI app' },
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, Rupay' },
    { id: 'netbanking', name: 'Net Banking', icon: Building2, desc: 'All major banks supported' }
  ];

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    try {
      setBalanceLoading(true);
      const response = await getWalletBalance();
      setBalance(response.walletBalance);
      setError(null);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError('Failed to fetch wallet balance. Please try again.');
    } finally {
      setBalanceLoading(false);
    }
  };

  const getSelectedAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0;
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    setError(null);
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 50000)) {
      setCustomAmount(value);
      setSelectedAmount(null);
      setError(null);
    }
  };

  const handleProceedToPayment = () => {
    const amount = getSelectedAmount();
    if (amount >= 10) {
      setStep('payment');
    } else {
      setError('Minimum amount is ₹10');
    }
  };

  const handlePayment = async () => {
    const amount = getSelectedAmount();
    setLoading(true);
    setStep('processing');
    setError(null);

    try {
      // Step 1: Initiate payment
      const initiateResponse = await initiateWalletTopUp(amount);
      setTransactionId(initiateResponse.payment.paymentId);

      // Step 2: Verify payment and credit wallet
      const verifyResponse = await verifyAndCreditWallet({
        paymentId: initiateResponse.payment.paymentId,
        amount: amount,
        userId: initiateResponse.payment.userId
      });
      
      if (verifyResponse.success) {
        await fetchBalance(); // Refresh the balance
        setStep('success');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setError('Payment failed. Please try again.');
      setStep('amount');
    } finally {
      setLoading(false);
    }
  };

  const resetFlow = () => {
    setStep('amount');
    setSelectedAmount(null);
    setCustomAmount('');
    setTransactionId('');
    setError(null);
  };

  const handleBalanceClick = () => {
    if (window.innerWidth <= 768) { // Only on mobile
      setIsBalanceFocused(true);
    }
  };

  const closeFocusedBalance = () => {
    setIsBalanceFocused(false);
  };

  // Balance Focus Overlay for Mobile
  const BalanceFocusOverlay = () => {
    if (!isBalanceFocused) return null;

    return (
      <div className="fixed inset-0 bgOp z-50 flex items-center justify-center p-6 md:hidden">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm transform transition-all duration-300 scale-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 rounded-t-3xl relative">
            <button 
              onClick={closeFocusedBalance}
              className="absolute top-4 right-4 w-8 h-8 z-50 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all"
            >
              <X className="w-4 h-4 text-orange-600" />
            </button>
            <div className="text-center">
              <p className="text-sm opacity-90 font-light">Wallet Balance</p>
            </div>
          </div>
          
          {/* Balance Display */}
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Wallet className="w-10 h-10 text-white" />
            </div>
            
            {balanceLoading ? (
              <div className="space-y-3">
                <div className="w-32 h-8 bg-gray-200 rounded-xl animate-pulse mx-auto"></div>
                <div className="w-24 h-4 bg-gray-100 rounded-lg animate-pulse mx-auto"></div>
              </div>
            ) : (
              <>
                <p className="text-4xl font-light text-orange-600 mb-2">₹{balance.toLocaleString()}</p>
                <p className="text-sm text-gray-500 font-light">Available Balance</p>
              </>
            )}
          </div>
          
          {/* Close Button */}
          <div className="p-6 pt-0">
            <button 
              onClick={closeFocusedBalance}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-2xl font-light hover:shadow-lg transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        {/* Header with glass effect */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 shadow-xl">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 hover:bg-opacity-30 transition-all cursor-pointer"
                 onClick={() => setStep('payment')}>
              <ArrowLeft className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-light tracking-wide">Processing Payment</h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <Loader2 className="w-12 h-12 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-extralight text-gray-800 mb-3">Processing Payment</h2>
          <p className="text-gray-500 text-center max-w-sm">Please wait while we confirm your transaction securely...</p>
          
          <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100 backdrop-blur-sm">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">Amount</p>
              <p className="text-2xl font-light text-gray-800">₹{getSelectedAmount()}</p>
              {transactionId && (
                <p className="text-xs text-gray-400 mt-3 font-mono">ID: {transactionId}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 shadow-xl">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 hover:bg-opacity-30 transition-all cursor-pointer"
                 onClick={resetFlow}>
              <ArrowLeft className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-light tracking-wide">Payment Successful</h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center min-h-[70vh] p-8">
          <div className="w-24 h-24 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl">
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-extralight text-gray-800 mb-3">Payment Successful!</h2>
          <p className="text-gray-500 text-center mb-8">₹{getSelectedAmount()} has been added to your wallet</p>
          
          <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
            <div className="text-center">
              <p className="text-gray-500 text-sm mb-2">New Wallet Balance</p>
              <p className="text-3xl font-extralight text-orange-600">₹{balance}</p>
              {transactionId && (
                <p className="text-xs text-gray-400 mt-4 font-mono">Transaction ID: {transactionId}</p>
              )}
            </div>
          </div>

          <button 
            onClick={resetFlow}
            className="w-full max-w-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-2xl font-light text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Add More Money
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {step !== 'amount' && (
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 hover:bg-opacity-30 transition-all cursor-pointer"
                     onClick={() => setStep('amount')}>
                  <ArrowLeft className="w-5 h-5" />
                </div>
              )}
              <h1 className="text-xl font-light tracking-wide">
                {step === 'amount' ? 'Add Money to Wallet' : 'Choose Payment Method'}
              </h1>
            </div>
          </div>
        </div>

        {/* Balance Card with glass morphism and click functionality */}
        <div className="p-6">
          <div 
            className="bg-white bg-opacity-80 backdrop-blur-sm rounded-3xl shadow-xl border border-white border-opacity-20 p-6 mb-8 cursor-pointer md:cursor-default hover:shadow-2xl hover:scale-102 md:hover:scale-100 transition-all duration-300 active:scale-95 md:active:scale-100"
            onClick={handleBalanceClick}
          >
            <div className="flex items-center">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-2xl flex items-center justify-center mr-4 shadow-lg flex-shrink-0">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 font-light">Current Balance</p>
                    <p className="text-2xl sm:text-3xl font-extralight text-gray-800 truncate">
                      {balanceLoading ? (
                        <span className="inline-block w-20 h-6 sm:h-8 bg-gray-200 rounded-xl animate-pulse"></span>
                      ) : (
                        `₹${balance}`
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message with soft styling */}
        {error && (
          <div className="px-6 mb-6">
            <div className="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl backdrop-blur-sm">
              <span className="font-light">{error}</span>
            </div>
          </div>
        )}

        {step === 'amount' && (
          <div className="p-6">
            {/* Quick Amount Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-light text-gray-700 mb-6">Choose Amount</h3>
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`p-4 sm:p-6 rounded-2xl border-2 transition-all duration-300 ${
                      selectedAmount === amount
                        ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 shadow-lg scale-105'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-orange-200 hover:shadow-md hover:scale-102'
                    }`}
                  >
                    <div className="text-center">
                      <p className="text-base sm:text-lg font-light">₹{amount}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div className="mb-8">
              <h3 className="text-lg font-light text-gray-700 mb-6">Or Enter Custom Amount</h3>
              <div className="relative">
                <span className="absolute left-6 top-6 text-gray-400 text-xl font-light">₹</span>
                <input
                  type="text"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Enter amount (Min ₹10, Max ₹50,000)"
                  className="w-full pl-12 pr-6 py-6 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none text-xl font-light bg-white hover:shadow-md transition-all duration-300"
                />
              </div>
              {(customAmount && parseInt(customAmount) < 10) && (
                <p className="text-red-500 text-sm mt-3 flex items-center font-light">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Minimum amount is ₹10
                </p>
              )}
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleProceedToPayment}
              disabled={getSelectedAmount() < 10}
              className={`w-full py-6 rounded-2xl font-light text-lg transition-all duration-300 ${
                getSelectedAmount() >= 10
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:shadow-2xl hover:scale-105'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              {getSelectedAmount() >= 10 ? `Proceed to Pay ₹${getSelectedAmount()}` : 'Select Amount'}
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="p-6">
            {/* Amount Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-2xl p-6 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-light">Amount to Add</span>
                <span className="text-2xl font-extralight text-orange-600">₹{getSelectedAmount()}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h3 className="text-lg font-light text-gray-700 mb-6">Choose Payment Method</h3>
              <div className="space-y-4">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                        selectedPayment === method.id
                          ? 'border-orange-400 bg-gradient-to-br from-orange-50 to-orange-100 shadow-lg scale-102'
                          : 'border-gray-200 bg-white hover:border-orange-200 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 transition-all ${
                          selectedPayment === method.id ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className={`font-light text-lg ${
                            selectedPayment === method.id ? 'text-orange-600' : 'text-gray-800'
                          }`}>
                            {method.name}
                          </p>
                          <p className="text-sm text-gray-500 font-light">{method.desc}</p>
                        </div>
                        {selectedPayment === method.id && (
                          <Check className="w-6 h-6 text-orange-600" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-6 rounded-2xl font-light text-lg hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  Processing...
                </>
              ) : (
                `Pay ₹${getSelectedAmount()}`
              )}
            </button>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-gray-50 bg-opacity-50 rounded-2xl backdrop-blur-sm">
              <p className="text-xs text-gray-500 text-center font-light">
                🔒 Your payment is secured with 256-bit SSL encryption
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Balance Focus Overlay */}
      <BalanceFocusOverlay />
    </>
  );
};

export default WalletTopUp;