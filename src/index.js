//DONE: instalar o websocket e o axios
const WebSocket = require('ws');
const api = require('./api');
const telegram = require('./telegram');
const ws = require('./websocket');

//DONE: Criar o meu client do websocket com a url da binance

//DONE: Criar apikey e secretkey na api da binance

//DONE: obeservar se a mensagem pertence ao SYMBOL BTCUSDT
const SYMBOL = 'BTCUSDT';

let quantity = 0;
let buyPrice = 0;
let profit = 1.001;
let isBought = false;

ws.onerror = function(error) {
    console.log(error);
}

ws.onmessage = async function(message) {
    const obj = JSON.parse(message.data);
    if(obj.s === SYMBOL) {
        process.stdout.write('\033c');
        console.table({
            "Symbol": obj.s,
            "Best ask": obj.a,
            "Best bid": obj.b,
            "Buy price": buyPrice,
            "Qty": quantity,
            "notional": buyPrice * quantity,
            "Target Price": buyPrice * profit
        })
        //DONE: criar fazer nossa ação de compra
        if(!isBought){
            isBought = true;
            const order = await api.buy(SYMBOL, 10);
            if(order.status !== 'FILLED'){
                console.log(order);
                process.exit(1);
            }

            quantity = parseFloat(order.executedQty);
            buyPrice = parseFloat(order.fills[0].price)
            telegram(`Bought at ${new Date()} by ${order.fills[0].price}`);
        }
        //DONE: criar fazer nossa ação de venda
        if(quantity > 0 && parseFloat(obj.b) > buyPrice * profit){
           const order = api.sell(SYMBOL, quantity, 0, 'SELL', 'MARKET');
            
           if(order.status !== 'FILLED'){
                console.log(order);
            } else {
                telegram(`Sold at ${new Date()} by ${order.fills[0].price}`);
            }
        }
    }
}


