const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();
const Db =process.env.CONNECTION_STRING; 
// "mongodb+srv://daam123:mobilefirstdaam123@mobilefirst.ttoxo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
let _db;
 
module.exports = {
  connectToServer:async function (callback) {
   await client.connect(function (err, db) {
        
      if (db)
      {
        _db = db.db(process.env.DATABASE);
        console.log("Successfully connected to MongoDB."); 
      }
      return callback(err);
    });
  },
 
  getDb: async function () {
    return _db;
  },

};