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
                    this.createScheduleForDate('21.01.2021',
                        ['06:30','08:00','09:30','11:00','13:00','14:30','16:00','17:30',]
                        )
                ),
                4
            );
            this.bot.sendMessage(chatId, '21.01.2021', opt);
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
        console.log(msg)
        const {data, from} = msg;
        const {message_id, chat} = msg.message
        let {reply_markup} = msg.message

        const parsedData = JSON.parse(data);

        reply_markup.inline_keyboard = reply_markup.inline_keyboard.map(arrays => {
            arrays = arrays.filter(item => {
                return parsedData.text !== item.text;
            })
            return arrays
        })

        const opt = {
            message_id: message_id,
            chat_id: chat.id,
        };

        this.bot.editMessageReplyMarkup(reply_markup, opt).then(
            () => {
                this.bot.sendMessage(from.id, "Вы забронировали " + parsedData.date + " на " + parsedData.text);
            }
        ).catch(
            () => {
                this.bot.sendMessage(from.id, "Ошибка, время уже занято");
            }
        );
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
        variants.forEach((variant) => {
            counter++;
            keyboardData.push(variant);
            if (counter >= numberOnLines) {
                keyboard.push(keyboardData);
                keyboardData = [];
                counter = 0;
            }
        })
        keyboard.push(keyboardData);
        return {
            parse_mode: 'markdown',
            disable_web_page_preview: true,
            reply_markup: JSON.stringify({
                inline_keyboard: keyboard
            })
        };
    }

    createScheduleForDate(date, times = []) {
        return times.map((time) => {
            return {
                text: time,
                date: date
            }
        })
    }
}

module.exports = Telegram;
