const api = require('./api');
const queryString = require('querystring');
const crypto = require('crypto');
const { default: axios } = require('axios');

const credentials = {
    apiKey: 'MMv4dbEC9lg0cYsC3jhhNKtqfGMXfDEC2YUwSHF3fYJswe6Msfw1sj4J9PGNJ4Rt',
    apiSecret: 'CkvAytsKDczCj7OojC35hEMXK5LDwgalbBUr0YUuVVgf0SS1VQI3K2uKd9whSXof',
    url: 'https://testnet.binance.vision/api'
}

async function buy (symbol, quoteOrderQty){
    const data = {symbol, side: 'BUY', type: 'MARKET', quoteOrderQty};
    return privateCall('/v3/order', data, 'POST');
}

async function sell(symbol, quantity, price, side = 'SELL', type = 'MARKET') {
    const data = {symbol, side, type, quantity};
    if(price) data.price = parseInt(price);
    return privateCall('/v3/order', data, 'POST');
}

async function privateCall(path, data={}, method="GET") {
    if(!credentials.apiKey || !credentials.apiSecret) {
        throw new Error('API key and secret key are required');
    }

    const timestamp = Date.now();
    const recvWindow = 60000;

    const signature = crypto
        .createHmac('sha256', credentials.apiSecret)
        .update(`${queryString.stringify({...data, timestamp, recvWindow})}`)
        .digest('hex');
    
    const newData = {...data, timestamp, recvWindow, signature};
    console.log(newData);
    const qs = `?${queryString.stringify(newData)}`;

    try {
        const response = await axios({
            method,
            url: `${credentials.url}${path}${qs}`,
            headers: {'X-MBX-APIKEY': credentials.apiKey}
        });
        return response.data;
    } catch (err) {
        console.log(err)
    }
}

module.exports = { buy, sell };