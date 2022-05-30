const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Users = express();
const jwt = require("jsonwebtoken");

const schema = require("../models");
const dbo = require("../database/conenction");
const nodemailer = require("../common/nodemailer");
const config = require("../common/config");
const checkToken = require("../common/authToken");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const path = require("path");

Users.use(cors());
Users.use(bodyParser.json());

let objId = require("mongodb").ObjectID;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../common/Uploads/");
  },

  // By default, multer removes file extensions so let's add them back
  filename: function (req, file, cb) {
    cb(null, Date.now());
  }
});

// Users.post('/upload-pic', (req, res) => {
//   // 'profile_pic' is the name of our file input field in the HTML form
//   let upload = multer({ storage: storage }).single('pic');

//   upload(req, res, function(err) {
//       // req.file contains information of uploaded file
//       // req.body contains information of text fields, if there were any

//       if (req.fileValidationError) {
//           return res.send(req.fileValidationError);
//       }
//       else if (!req.file) {
//           return res.send('Please select an image to upload');
//       }
//       else if (err instanceof multer.MulterError) {
//           return res.send(err);
//       }
//       else if (err) {
//           return res.send(err);
//       }

//       // Display uploaded image for user validation
//       res.send(`You have uploaded this image: <hr/><img src="${req.file.path}" width="500"><hr /><a href="./">Upload another image</a>`);
//   });
// });

// Users.post("/upload",upload.single('file'), (req,res, next) => {
//   console.log(req.file)
//   console.log("file",req.file)
// })

Users.post("/addNewUser", (req, res) => {
  try {
    dbo.getDb().then((db_connect) => {
      let myobj = {
        ...req.body
      };
      // const otp = Math.floor(100000 + Math.random() * 900000);
      db_connect.collection("users").insertOne(myobj, function (err, data) {
        if (err) throw err;
        // nodemailer.mail({
        //   ...myobj,
        //   template: config.templates.Signup,
        //   name: myobj.email.split("@")[0],
        //   otp,
        // });
        res.status(201).json({ success: true, data });
      });
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
});

Users.get("/getUserList", (req, res) => {
  try {
    dbo.getDb().then((db_connect) => {
      db_connect
        .collection("users")
        .find({ $or: [{ isDelete: { $exists: false } }, { isDelete: false }] })
        .toArray((err, data) => {
          if (err) {
            res.status(201).json({ success: false, err });
          } else {
            res.status(201).json({ success: true, data });
          }
        });
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
});

Users.get("/getUserListforAgents/:address", checkToken, (req, res) => {
  try {
    dbo.getDb().then((db_connect) => {
      console.log(req.params);
      db_connect
        .collection("users")
        .find(
          {
            $or: [
              { agentAddress: req.params.address },
              {
                $and: [
                  {
                    $or: [{ isDelete: { $exists: false } }, { isDelete: false }]
                  },
                  { userType: "creator" },
                  { invitation: "pending" },
                  { "blockChainAddress.addr": { $exists: true } }
                ]
              }
            ]
          },
          {
            _id: 1,
            email: 1,
            name: 1,
            phone: 1,
            "blockChainAddress.addr": 1,
            invitation: 1
          }
        )
        .toArray((err, data) => {
          if (err) {
            res.status(201).json({ success: false, err });
          } else {
            res.status(201).json({ success: true, data });
          }
        });
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
});

Users.post("/forgotpassword", (req, res) => {
  try {
    dbo.getDb().then((db_connect) => {
      db_connect
        .collection("users")
        .findOne({ email: req.body.email }, (err, data) => {
          if (err) {
            res.status(201).json({ success: false, err });
          } else {
            if (data) {
              db_connect
                .collection("users")
                .updateOne(
                  { email: req.body.email },
                  { $set: { password: req.body.password } },
                  function (err, data) {
                    if (err) throw err;
                    if (data) {
                      db_connect
                        .collection("users")
                        .findOne({ email: req.body.email }, (er, data) => {
                          if (er) throw er;
                          res.status(201).json({ success: true, data });
                        });
                    }
                  }
                );
            } else {
              res.status(201).json({ success: false, data });
            }
          }
        });
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
});

Users.post("/login", (req, res) => {
  try {
    dbo.getDb().then((db_connect) => {
      db_connect.collection("users").findOne({ ...req.body }, (err, data) => {
        if (err) {
          res.status(201).json({ success: false, err });
        } else {
          if (data) {
            const user = { email: req.body.email };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            res.status(201).json({
              success: true,
              data: { ...data, accessToken: accessToken }
            });
          } else {
            res.status(201).json({ success: false, data });
          }
        }
      });
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorizaiton"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(401);
    // res.status(201).json({ success: true, token:token, user:user})
    req.user = user;
    next();
  });
};

//just to check valid token
Users.get("/auth", checkToken, (req, res) => {
  if (req.body.userDetails != null) {
    res
      .status(201)
      .json({ validToken: true, userDetails: req.body.userDetails });
  }
});

Users.post("/sendverificationemail", (req, res) => {
  try {
    dbo.getDb().then((db_connect) => {
      console.log(req.body);
      let myobj = {
        ...req.body
      };
      db_connect
        .collection("users")
        .findOne({ email: req.body.email }, (err, data) => {
          if (err) {
            res.status(201).json({ success: false, err });
          }
          if (data && !req.body.isResetingPassword) {
            res.status(201).json({
              success: false,
              data: { ...data, status: "email already exsit!" }
            });
          } else {
            // console.log(myobj);
            const otp = Math.floor(100000 + Math.random() * 900000);
            console.log("OTP" ,otp)
            nodemailer
              .mail({
                ...myobj,
                template: req.body.isAgent
                  ? config.templates.AgentSignup
                  : req.body.isCreator
                  ? config.templates.CreatorSignup
                  : req.body.isCollector
                  ? config.templates.CollectorSignup
                  : req.body.isAdmin
                  ? config.templates.AdminSignup
                  : req.body.isResetingPassword
                  ? config.templates.resetPassword
                  : config.templates.Signup,
                name: myobj.email.split("@")[0],
                otp
              })
              .then((mailRes) =>
                res.status(201).json({ success: true, mailRes, otp })
              )
              .catch((err) => res.status(201).json({ success: false, err }));
          }
        });
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
});

Users.post("/updateUserById", (req, res) => {
  try {
    dbo.getDb().then((db_connect) => {
      const where = {
        _id: new objId(req.body.where._id)
      };
      let myobj = {
        ...req.body.update
      };

      // console.log(where,myobj)
      db_connect
        .collection("users")
        .updateOne(where, { $set: myobj }, function (err, data) {
          if (err) throw err;
          if (data) {
            db_connect.collection("users").findOne(where, (er, data) => {
              if (er) throw er;
              res.status(201).json({ success: true, data });
            });
          }
        });
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message
    });
  }
});

Users.post("/sendinviteemail", (req, res) => {
  let myobj = {
    ...req.body
  };
  let db_connect = dbo.getDb();
  const otp = Math.floor(100000 + Math.random() * 900000);
  console.log(myobj);
  nodemailer
    .mail({
      ...myobj,
      template: config.templates.InviteCreator,
      subject: `👻 Joining Invitation from ${myobj.agentAddress}`,
      otp
    })
    .then((mailRes) => res.status(201).json({ success: true, mailRes, otp }))
    .catch((err) => res.status(201).json({ success: false, err }));
});

Users.get("/getuserswithcollection", (req, res) => {
  dbo
    .getDb()
    .then((db_connect) => {
      db_connect
        .collection("users")
        .find({ "collections.1": { $exists: true } })
        .toArray((err, data) => {
          if (err) {
            res.status(500).json({ success: false, err });
          } else {
            res.status(201).json({ success: true, data });
          }
        });
    })
    .catch((err) => res.status(500).json({ success: false, err }));
});

module.exports = Users;
