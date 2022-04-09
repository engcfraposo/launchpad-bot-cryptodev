//DONE: configurar o bot para enviar informações ao telegram
const { Telegraf } = require('telegraf');

module.exports = function telegram(data){
    const bot = new Telegraf("5138986127:AAHgaLXiPjkABWl2bc3XjTKwX20wwwkRTYU");
    bot.telegram.sendMessage("1265660877", data);
}