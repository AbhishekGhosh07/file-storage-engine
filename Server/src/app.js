require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const route = require('./Routes/routing');
const myReqLogger = require('./Utilities/requestLogger');
const myErrLogger = require('./Utilities/errorLogger');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(myReqLogger);
app.use('/',route);
app.use(myErrLogger);


// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
