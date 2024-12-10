const express = require('express');
const bodyParser = require('body-parser');
const route = require('./Routes/routing');

const app = express();
const PORT = 3000;
app.use(bodyParser.json());
app.use('/',route);


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
