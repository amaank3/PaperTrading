import React, { useState } from "react";

const TradeForm = ({ selectedAsset, balance, onTradeComplete, username }) => {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrade = async (type) => {
    if (!selectedAsset || !quantity) {
      setError("Please select an asset and enter quantity");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      console.log("Sending trade request...");
      const response = await fetch("http://127.0.0.1:5001/api/trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username || 'demo_user',
          symbol: selectedAsset,
          quantity: parseFloat(quantity),
          type: type,
          price: 100 // This should come from your market data in a real app
        }),
      });
      
      console.log("Trade response:", response);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to execute trade");
      }
      
      setQuantity("");
      onTradeComplete();
      alert(`${type.toUpperCase()} order executed successfully!`);
    } catch (error) {
      console.error("Trade error:", error);
      setError(error.message || "Failed to execute trade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-4">Make a Trade</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Selected Asset
            </label>
            <div className="mt-1 text-lg font-bold">
              {selectedAsset || "Select an asset"}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={!selectedAsset || loading}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}
          
          <div className="flex gap-4">
            <button
              onClick={() => handleTrade("buy")}
              disabled={!selectedAsset || !quantity || loading}
              className={`flex-1 px-4 py-2 rounded-md text-white ${
                !selectedAsset || !quantity || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {loading ? "Processing..." : "Buy"}
            </button>
            <button
              onClick={() => handleTrade("sell")}
              disabled={!selectedAsset || !quantity || loading}
              className={`flex-1 px-4 py-2 rounded-md text-white ${
                !selectedAsset || !quantity || loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              {loading ? "Processing..." : "Sell"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeForm;