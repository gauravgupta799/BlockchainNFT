const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dbo = require("../database/conenction");
const config = require("../common/config");
const upload = require("../common/upload");
const dotenv = require("dotenv");
dotenv.config();

const fileActions = express();

fileActions.use(cors());
fileActions.use(bodyParser.json());

let objId = require("mongodb").ObjectID;

const MongoClient = require("mongodb").MongoClient;
const GridFSBucket = require("mongodb").GridFSBucket;
// const url = dbConfig.url;
// const baseUrl = "http://localhost:5002/files/";

// const mongoClient = new MongoClient(url);

fileActions.post("/upload", async (req, res) => {
  try {
    await upload(req, res);
    if (req.file === undefined) {
      return res.send({
        message: "You must select a file.",
      });
    }
    return res.send({
      ...req.file,
      message: " success",
    });
  } catch (error) {
    return res.send({
      message: "Error when trying upload image: ${error}",
    });
  }
});

fileActions.get("/images/:name", async (req, res) => {
  try {
    dbo.getDb().then((db_connect) => {
      const bucket = new GridFSBucket(db_connect, {
        bucketName: process.env.IMG_BUCKET,
      });

      let downloadStream = bucket.openDownloadStreamByName(req.params.name);

      downloadStream.on("data", function (data) {
        return res.status(200).write(data);
      });

      downloadStream.on("error", function (err) {
        return res.status(404).send({ message: "Cannot download the Image!" });
      });

      downloadStream.on("end", () => {
        return res.end();
      });
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
});

module.exports = fileActions;
