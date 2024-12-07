import React, { useState } from 'react';

const FundsManager = ({ onFundsUpdate }) => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFunds = async (action) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:5001/api/funds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          action: action
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${action} funds`);
      }

      setAmount('');
      onFundsUpdate();
      alert(`Successfully ${action}ed $${amount}`);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Manage Funds</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amount ($)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter amount"
            min="0"
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => handleFunds('add')}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Add Funds'}
          </button>
          <button
            onClick={() => handleFunds('withdraw')}
            disabled={loading}
            className="flex-1 px-4 py-2 rounded-md text-white bg-red-500 hover:bg-red-600 disabled:bg-gray-400"
          >
            {loading ? 'Processing...' : 'Withdraw Funds'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FundsManager;