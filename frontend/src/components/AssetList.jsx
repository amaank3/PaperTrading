import React, { useState, useEffect } from "react";

const AssetList = ({ onAssetSelect, selectedAsset }) => {
  const [activeTab, setActiveTab] = useState("crypto");
  const [marketData, setMarketData] = useState({
    crypto: {},
    stocks: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const cryptoResponse = await fetch('http://127.0.0.1:5001/api/crypto/prices');
        console.log('Crypto response:', cryptoResponse);
        
        if (!cryptoResponse.ok) {
          throw new Error(`HTTP error! status: ${cryptoResponse.status}`);
        }
        
        const cryptoData = await cryptoResponse.json();
        console.log('Crypto data:', cryptoData);

        const stocksResponse = await fetch('http://127.0.0.1:5001/api/stocks/prices');
        const stocksData = await stocksResponse.json();

        setMarketData({
          crypto: cryptoData,
          stocks: stocksData
        });
        setError(null);
      } catch (e) {
        console.error('Fetch error:', e);
        setError(e.toString());
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderAssetList = (data) => {
    if (Object.keys(data).length === 0) {
      return <div className="p-4 text-gray-500">No data available</div>;
    }

    return (
      <div className="space-y-4 mt-4">
        {Object.entries(data).map(([symbol, details]) => (
          <div
            key={symbol}
            onClick={() => onAssetSelect(symbol)}
            className={`flex justify-between items-center p-4 rounded-lg cursor-pointer transition-colors ${
              selectedAsset === symbol
                ? "bg-blue-100 border-blue-500"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            <div>
              <div className="font-bold">{symbol}</div>
              <div>${details.price.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}</div>
            </div>
            <div className={`flex items-center ${
              details.change >= 0 ? "text-green-500" : "text-red-500"
            }`}>
              {details.change >= 0 ? (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              ) : (
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              )}
              {Math.abs(details.change).toFixed(2)}%
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="mt-6">
      <div className="border-b">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("crypto")}
            className={`px-4 py-2 font-medium ${
              activeTab === "crypto"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Cryptocurrency
          </button>
          <button
            onClick={() => setActiveTab("stocks")}
            className={`px-4 py-2 font-medium ${
              activeTab === "stocks"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Stocks
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <div className="mt-2">Loading...</div>
        </div>
      ) : error ? (
        <div className="p-4 text-red-500">Error: {error}</div>
      ) : (
        <div>
          {activeTab === "crypto" && renderAssetList(marketData.crypto)}
          {activeTab === "stocks" && renderAssetList(marketData.stocks)}
        </div>
      )}
    </div>
  );
};

export default AssetList;