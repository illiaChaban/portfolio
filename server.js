const express = require('express');

const app = express();
const port = 5000;
const pageBuilder = require("./pageBuilderRoute");

// const bodyparser = require('body-parser');
// app.use(bodyparser.text());
// app.use(bodyparser.json());


app.use(pageBuilder); // serve html

app.use(express.static(__dirname + '/assets')); // serve js, css and images

app.listen(port, () => console.log(`Example app listening on port ${port}!`));