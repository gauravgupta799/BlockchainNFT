var jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  var token = req.headers.token;
  if (
    token !== "undefined" &&
    token !== "" &&
    token !== "null" &&
    token !== undefined &&
    token !== null
  ) {
    // let deCryptedToken = cryptr.decrypt(token);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        res
          .status(403)
          .json({ success: false, message: "Failed to authenticate user." });
      } else {
        req.body.userDetails = decodedToken;
        next();
      }
    });
  } else {
    res.status(501).json({ success: false, token: "No Token Provided." });
  }
};
