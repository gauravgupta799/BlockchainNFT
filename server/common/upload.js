const util = require("util");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const dotenv = require("dotenv");
dotenv.config();

var storage = new GridFsStorage({
  url: process.env.CONNECTION_STRING,
  options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    // console.log(
    //   "request",
    //   file,
    //   process.env.IMG_BUCKET,
    //   `${Date.now()}-${file.originalname}`
    // );
    // const match = ["image/png", "image/jpeg"];
    // if (match.indexOf(file.mimetype) === -1) {
    //   const filename = `${Date.now()}-${file.originalname}`;
    //   return filename;
    // }
    return {
      bucketName: process.env.IMG_BUCKET,
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

var uploadFiles = multer({ storage: storage }).single("file");
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
