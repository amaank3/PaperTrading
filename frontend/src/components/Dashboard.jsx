import React, { useState, useEffect } from 'react';
import AssetList from './AssetList';
import TradeForm from './TradeForm';
import FundsManager from './FundsManager';

const Dashboard = () => {
  const [balance, setBalance] = useState(10000);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [profitLoss, setProfitLoss] = useState(0);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [portfolio, setPortfolio] = useState([]);
  const [username] = useState('demo_user');

  const fetchBalanceInfo = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/balance`);
      const data = await response.json();
      setBalance(data.balance);
      setPortfolioValue(data.portfolio_value);
      setProfitLoss(data.profit_loss);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchPortfolio = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5001/api/portfolio`);
      const data = await response.json();
      setPortfolio(data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  useEffect(() => {
    fetchBalanceInfo();
    fetchPortfolio();
  }, []);

  const handleTradeComplete = () => {
    fetchBalanceInfo();
    fetchPortfolio();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-2">Cash Balance</h2>
            <p className="text-3xl font-bold">${balance.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-2">Portfolio Value</h2>
            <p className="text-3xl font-bold">${portfolioValue.toLocaleString()}</p>
          </div>
          <div className={`bg-white rounded-lg shadow-md p-6 ${
            profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            <h2 className="text-xl font-bold mb-2">Profit/Loss</h2>
            <p className="text-3xl font-bold">
              ${Math.abs(profitLoss).toLocaleString()}
              {profitLoss >= 0 ? ' ▲' : ' ▼'}
            </p>
          </div>
        </div>

        <FundsManager onFundsUpdate={fetchBalanceInfo} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Market Overview</h2>
              <AssetList 
                onAssetSelect={setSelectedAsset} 
                selectedAsset={selectedAsset}
              />
            </div>
          </div>
          
          <div>
            <TradeForm
              selectedAsset={selectedAsset}
              balance={balance}
              onTradeComplete={handleTradeComplete}
              username={username}
            />
            
            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h2 className="text-xl font-bold mb-4">Portfolio</h2>
              <div className="space-y-4">
                {Object.entries(portfolio).map(([symbol, details]) => (
                  <div key={symbol} className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{symbol}</div>
                      <div className="text-sm text-gray-500">
                        {details.quantity.toFixed(4)} units
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        ${(details.quantity * details.avg_price).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg: ${details.avg_price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
                {Object.keys(portfolio).length === 0 && (
                  <div className="text-gray-500">No assets in portfolio</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;