const express = require('express')
const app = express()
const port = 5000;
const bodyparser = require('body-parser');

app.use(bodyparser.text());
// app.use(bodyparser.json());
app.get("/", (req, res) => {
    console.log("hello world")
})

app.use(express.static(__dirname + '/static'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));