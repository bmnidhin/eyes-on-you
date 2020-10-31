const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 5000;

let html = "<h1>Make a Ton</h1>"
var rooms=[];
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static("static"));
// Home route
app.get("/", (req, res) => {
    res.send(html);
  });

app.post("/reload", function(req, res) {
    if (rooms[Number(req.body.room)]) {
        res.json(rooms[Number(req.body.room)].users);
        rooms[Number(req.body.room)].users = [];
    } else {
        res.json(false);
    }

});
app.post("/joinroom", function(req, res) {
    rooms[req.body.room].users.push(req.body.key);
    console.log('joined room: '+req.body.room);
    res.json(rooms[req.body.room].p);
});
app.post("/createroom", function(req, res) {
    console.log("room created : "+req.body.room);
    rooms[req.body.room] = { p: req.body.key, users: [] };
    res.json(true);
});
app.post("/getroom", function(req, res) {
    res.json(rooms[req.body.room].p);
    console.log('getting room...'+req.body.room);
});

// Listen on port 5000
app.listen(port, () => {
  console.log(`Server is booming on port 5000
Visit http://localhost:5000`);
});