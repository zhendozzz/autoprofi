const TelegramBot = require('node-telegram-bot-api');

class Telegram {
    bot;

    commands = {
        '/start': (msg) => {
            this.bot.sendMessage(msg.chat.id, 'Вы подписались')
        },
        '/booking': (msg) => {
            const chatId = msg.chat.id;
            const opt = this.buildKeyboardMessage(
                this.buildKeyboardVariants(
                    [{
                        text: '16:30',
                        date: '21.01.2021'
                    }]
                )
            );
            this.bot.sendMessage(chatId, 'text', opt);
        }
    };

    callBackQueries = {};

    events = {
        'message': (msg) => {
            this.processMessage(msg);
        },
        'polling_error': (err) => {
            console.log(err);
        },
        'callback_query': (msg) => {
            this.processCallBackQuery(msg);
        }
    };

    constructor() {
        const autoProfiTelegramBotToken = process.env.autoprofi_telegram_bot_token;
        this.bot = new TelegramBot(autoProfiTelegramBotToken, {
            polling: true,
            filepath: false,
        });
        this.registerEvents();
    }

    registerEvents() {
        for (const event in this.events) {
            this.bot.on(event, this.events[event]);
        }
    }

    processMessage(msg) {
        const text = msg.text;
        const command = this.commands[text];
        if (command !== undefined) {
            command(msg);
        }
    }

    processCallBackQuery(msg) {
        const data = JSON.parse(msg.data);
        //const {time, date} = data;
        console.log(msg);
    }

    buildKeyboardVariants(objects = []) {
        let result = [];
        objects.forEach((object) => {
            result.push({
                text: object.text,
                callback_data: JSON.stringify(object)
            })

        })
        return result;
    }

    buildKeyboardMessage(variants = [], numberOnLines = 3) {
        let counter = 0;
        let keyboard = [];
        let keyboardData = [];
        for (let i = 0; i < variants.length; i++) {
            counter++;
            const variant = variants[i];
            keyboardData.push(variant);
            if (counter >= numberOnLines) {
                keyboard.push(keyboardData);
                keyboardData = [];
                counter = 0;
            }
        }
        keyboard.push(keyboardData);
        const opt = {
            parse_mode: 'markdown',
            disable_web_page_preview: true,
            reply_markup: JSON.stringify({
                inline_keyboard: keyboard
            })
        };
        return opt;
    }
}

module.exports = Telegram;
