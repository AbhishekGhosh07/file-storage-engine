const fs = require('fs');
 
const logger = function (err, req, res, next) {
  console.log('in errorLogger');
 
  if (err) {
    fs.appendFile('ErrorLogger.log', `${err.stack}\n\n`, function (err) {
      if (err) {
        console.log('logging error failed');
      }
    });
    if (err.status) {
      res.status(err.status);
    } else {
      res.status(500);
    }
    res.status(400).json({ message: err.message });
  }
};
 
module.exports = logger;