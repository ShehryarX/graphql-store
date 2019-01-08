const express = require("express");

const app = express();

// listen to port
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening to port ${port}`));
