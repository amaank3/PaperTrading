from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import logging
import requests
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Cache to store API responses and minimize requests
price_cache = {
    'crypto': {'data': {}, 'timestamp': 0},
    'stocks': {'data': {}, 'timestamp': 0}
}

CACHE_DURATION = 30  # seconds
ALPHA_VANTAGE_API_KEY = os.getenv('ALPHA_VANTAGE_API_KEY')

# In-memory storage for user data
users = {
    'demo_user': {
        'balance': 10000,
        'portfolio': {},
        'initial_balance': 10000,
        'transactions': []
    }
}

# ... (previous imports remain same)

def get_crypto_prices_data():
    try:
        current_time = datetime.now().timestamp()
        if current_time - price_cache['crypto']['timestamp'] < CACHE_DURATION:
            return price_cache['crypto']['data']

        # Expanded list of cryptocurrencies
        coins = ','.join([
            'bitcoin',          # BTC
            'ethereum',         # ETH
            'binancecoin',      # BNB
            'ripple',           # XRP
            'cardano',          # ADA
            'solana',           # SOL
            'dogecoin',         # DOGE
            'polkadot',         # DOT
            'avalanche-2',      # AVAX
            'chainlink',        # LINK
            'polygon',          # MATIC
            'uniswap',          # UNI
            'litecoin',         # LTC
            'bitcoin-cash',     # BCH
            'stellar',          # XLM
            'monero',           # XMR
            'cosmos',           # ATOM
            'ethereum-classic', # ETC
            'hedera-hashgraph', # HBAR
            'filecoin',         # FIL
        ])

        response = requests.get(
            'https://api.coingecko.com/api/v3/simple/price',
            params={
                'ids': coins,
                'vs_currencies': 'usd',
                'include_24hr_change': 'true'
            }
        )
        data = response.json()

        # Mapping of CoinGecko IDs to ticker symbols
        symbol_mapping = {
            'bitcoin': 'BTC',
            'ethereum': 'ETH',
            'binancecoin': 'BNB',
            'ripple': 'XRP',
            'cardano': 'ADA',
            'solana': 'SOL',
            'dogecoin': 'DOGE',
            'polkadot': 'DOT',
            'avalanche-2': 'AVAX',
            'chainlink': 'LINK',
            'polygon': 'MATIC',
            'uniswap': 'UNI',
            'litecoin': 'LTC',
            'bitcoin-cash': 'BCH',
            'stellar': 'XLM',
            'monero': 'XMR',
            'cosmos': 'ATOM',
            'ethereum-classic': 'ETC',
            'hedera-hashgraph': 'HBAR',
            'filecoin': 'FIL',
        }

        formatted_data = {}
        for coin_id, symbol in symbol_mapping.items():
            if coin_id in data:
                formatted_data[symbol] = {
                    'price': data[coin_id]['usd'],
                    'change': data[coin_id]['usd_24h_change']
                }

        price_cache['crypto'] = {
            'data': formatted_data,
            'timestamp': current_time
        }
        return formatted_data

    except Exception as e:
        logger.error(f"Error fetching crypto prices: {str(e)}")
        if price_cache['crypto']['data']:
            return price_cache['crypto']['data']
        return {'BTC': {'price': 45000, 'change': 0}}

def get_stock_prices_data():
    try:
        current_time = datetime.now().timestamp()
        if current_time - price_cache['stocks']['timestamp'] < CACHE_DURATION:
            return price_cache['stocks']['data']

        # Expanded list of stocks from different sectors
        stocks = [
            # Tech
            'AAPL',  # Apple
            'MSFT',  # Microsoft
            'GOOGL', # Alphabet
            'AMZN',  # Amazon
            'META',  # Meta (Facebook)
            'NVDA',  # NVIDIA
            'TSLA',  # Tesla
            
            # Finance
            'JPM',   # JPMorgan Chase
            'BAC',   # Bank of America
            'V',     # Visa
            
            # Healthcare
            'JNJ',   # Johnson & Johnson
            'PFE',   # Pfizer
            'UNH',   # UnitedHealth
            
            # Retail
            'WMT',   # Walmart
            'TGT',   # Target
            'COST',  # Costco
            
            # Entertainment
            'NFLX',  # Netflix
            'DIS',   # Disney
            
            # Others
            'COCA',  # Coca-Cola
            'NKE',   # Nike
        ]

        formatted_data = {}
        
        # Alpha Vantage has a rate limit, so we'll batch requests
        for symbol in stocks:
            try:
                response = requests.get(
                    'https://www.alphavantage.co/query',
                    params={
                        'function': 'GLOBAL_QUOTE',
                        'symbol': symbol,
                        'apikey': ALPHA_VANTAGE_API_KEY
                    }
                )
                data = response.json()
                
                if 'Global Quote' in data:
                    quote = data['Global Quote']
                    formatted_data[symbol] = {
                        'price': float(quote['05. price']),
                        'change': float(quote['10. change percent'].rstrip('%'))
                    }
                else:
                    logger.warning(f"No data for {symbol}: {data}")
            except Exception as e:
                logger.error(f"Error fetching {symbol}: {str(e)}")
                continue

        if formatted_data:  # Only update cache if we got some data
            price_cache['stocks'] = {
                'data': formatted_data,
                'timestamp': current_time
            }
        return formatted_data

    except Exception as e:
        logger.error(f"Error fetching stock prices: {str(e)}")
        if price_cache['stocks']['data']:
            return price_cache['stocks']['data']
        return {'AAPL': {'price': 150, 'change': 0}}

# Optional: Add a helper route to get available symbols
@app.route('/api/available-symbols', methods=['GET'])
def get_available_symbols():
    crypto_data = get_crypto_prices_data()
    stock_data = get_stock_prices_data()
    
    return jsonify({
        'crypto': list(crypto_data.keys()),
        'stocks': list(stock_data.keys())
    })
# Your existing routes remain the same, they'll now use the real API data
@app.route('/api/crypto/prices', methods=['GET'])
def get_crypto_prices():
    return jsonify(get_crypto_prices_data())

@app.route('/api/stocks/prices', methods=['GET'])
def get_stock_prices():
    return jsonify(get_stock_prices_data())

# ... rest of your code remains the same ...

@app.route('/api/portfolio', methods=['GET'])
def get_portfolio():
    username = 'demo_user'
    return jsonify(users[username]['portfolio'])

@app.route('/api/funds', methods=['POST'])
def manage_funds():
    try:
        data = request.json
        username = 'demo_user'
        amount = float(data['amount'])
        action = data['action']  # 'add' or 'withdraw'
        
        if action == 'withdraw' and amount > users[username]['balance']:
            return jsonify({'error': 'Insufficient funds'}), 400
            
        if action == 'add':
            users[username]['balance'] += amount
        else:
            users[username]['balance'] -= amount
            
        users[username]['transactions'].append({
            'type': action,
            'amount': amount,
            'timestamp': datetime.now().isoformat()
        })
        
        return jsonify({
            'message': f'Successfully {action}ed {amount}',
            'new_balance': users[username]['balance']
        })
        
    except Exception as e:
        logger.error(f"Error managing funds: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    logger.info("Starting Flask server...")
    app.run(debug=True, host='0.0.0.0', port=5001)

