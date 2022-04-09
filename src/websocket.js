const WebSocket = require('ws');
const ws = new WebSocket('wss://stream.binance.com:9443/ws/!bookTicker');
module.exports = ws