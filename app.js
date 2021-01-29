const express = require("express");
const app = express();
const routes = require("./routes/index");
const path = require('path');
const jwt = require("jsonwebtoken");
const cors = require('cors');
const tokenKey = "1a2b-3c4d-5e6f-7g8h";

const Telegram = require('./telegram.js');
const telegram = new Telegram();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    if (req.headers.authorization) {
        jwt.verify(
            req.headers.authorization.split(" ")[1],
            tokenKey,
            (err, payload) => {
                if (err) next();
                else if (payload) {
                    for (let user of users) {
                        if (user.id === payload.id) {
                            req.user = user;
                            next();
                        }
                    }

                    if (!req.user) next();
                }
            }
        );
    }

    next();
});

app.use("/api", routes);
module.exports = app;
