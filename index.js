const express = require("express");
const morgan = require('morgan')
const app = express();
const cors = require('cors');

const port = 5000;

let html = "<h1>Make a Ton</h1>"

app.use(cors());
// Body parser
app.use(express.urlencoded({ extended: false }));

// Morgan
app.use(morgan('tiny'))

// Home route
app.get("/", (req, res) => {
    res.send(html);
  });

// Listen on port 5000
app.listen(port, () => {
  console.log(`Server is booming on port 5000
Visit http://localhost:5000`);
});