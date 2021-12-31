var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '5007720080:AAGDWoTJ2HXF6zeiZ3C9znAcvF1tsJS31Lc'
const bot = new TelegramBot(token, {polling: true});

state = 0
// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `Hello ! ${msg.chat.first_name}, welcome...\n
        click /predict`
    ); 
    state = 0;
});
// input requires x1 , x2 dan x3
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `Masukan nilai x1|x2|x3 contohnya 3|3|3`
    );
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        x1 = s[0]
        x2 = s[1]
        x3 = s[2]
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1]),
                parseFloat(s[2])
            ]
        ).then((jres)=>{
                bot.sendMessage(
                    msg.chat.id,
                    `Prediksi nilai y1 yaitu ${jres[0]}`
                );
                bot.sendMessage(
                    msg.chat.id,
                    `Prediksi nilai y2 yaitu ${jres[1]}`
                ); 
                bot.sendMessage(
                    msg.chat.id,
                    `Prediksi nilai y3 yaitu ${jres[2]}`
                );
        })
    }else{
        state = 0;
    }
})
// routers
r.get('/predict/:x1/:x2/:x3', function(req, res, next) {
    model.predict(
        [
            parseFloat(req.params.x1),// string float
            parseFloat(req.params.x2),
            parseFloat(req.params.x3)
        ]    
    ).then((jres)=>{
        res.json(jres);
    })
});
module.exports = r;
