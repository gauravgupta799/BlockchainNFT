const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const CryptoJS = require("crypto-js");
const server = express();

server.use(cors());
server.use(bodyParser.json());

const modifyRequestBody = (req, res, next) => {
  if (req.body?.data) {
    const bytes = CryptoJS.AES.decrypt(req.body.data, "DAAMAgency");
    const originalBody = bytes.toString(CryptoJS.enc.Utf8);
    req.body = JSON.parse(originalBody);
  }
  next();
};

const modifyResponseBody = (req, res, next) => {
  if (req.url.startsWith("/files/images")) {
    next();
  } else {
    let oldSend = res.send;
    res.send = function (data) {
      const ciphertext = CryptoJS.AES.encrypt(
        JSON.stringify(arguments[0]),
        "DAAMAgency"
      ).toString();

      arguments[0] = ciphertext;
      oldSend.apply(res, arguments);
    };
    next();
  }
};
server.use(modifyRequestBody);
server.use(modifyResponseBody);

const users = require("./Routes/User");
server.use("/users", users);

const fileController = require("./Routes/FileActions");
server.use("/files", fileController);

module.exports = server;
