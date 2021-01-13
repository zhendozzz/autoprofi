const express = require("express");
const app = express();
const https = require("https");
const fs = require("fs");
const routes = require("./routes/index");
const jwt = require("jsonwebtoken");

const host = "localhost";
const port = 443;
const tokenKey = "1a2b-3c4d-5e6f-7g8h";

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


https
  .createServer(
    {
      key: fs.readFileSync("./cert/key.pem"),
      cert: fs.readFileSync("./cert/cert.pem"),
    },
    app
  )
  .listen(port, host, function () {
    console.log(`Server listens https://${host}:${port}`);
  });
