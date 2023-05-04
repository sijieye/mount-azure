const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'availability_viewer', 'build')));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port} .`);
});