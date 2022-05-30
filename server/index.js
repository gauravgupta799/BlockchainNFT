const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const https = require("https");
const fs = require("fs");

const app = require("./app");
const dbo = require("./database/conenction");

const options = {
  key: fs.readFileSync("key.pem"),
  cert: fs.readFileSync("cert.pem"),
};

app.use(cors());

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");
  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);
  // Pass to next layer of middleware
  next();
});
console.log(process.env.NODE_ENV);
dotenv.config();
console.log(process.env.CONNECTION_STRING)

mongoose.connect(process.env.CONNECTION_STRING);
mongoose.Promise = global.Promise;

mongoose.connection
  .once("open", () => console.log("Connected to MongoLab instance."))
  .on("error", (error) => console.log("Error connecting to MongoLab:", error));

dbo.connectToServer((err) => {
  if (err) console.error(err);
});
// app.listen(process.env.PORT, () => {
//   console.log(`Magic is happening on ${process.env.PORT}`);
// });
// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
// https.createServer(options, app).listen(process.env.PORT, () => {
//   console.log(`Magic is happening on ${process.env.PORT}`);
// });
app.listen(process.env.PORT, () => {
  console.log(`Magic is happening on ${process.env.PORT}`);
});
