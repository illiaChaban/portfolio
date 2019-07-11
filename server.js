const express = require('express');
const fs = require('fs');

const app = express();
const port = 5000;
// const pageBuilder = require("./pageBuilderRoute");

// const bodyparser = require('body-parser');
// app.use(bodyparser.text());
// app.use(bodyparser.json());


function generateStaticHtml() {
  const pages = [
    'home', 'skills'
  ];

  let index = fs.readFileSync('./html/index.html', 'utf8');
  fs.writeFileSync(`./docs/index.html`, index);

  pages.forEach( page => {
    let content = fs.readFileSync(`./html/${page}.html`, 'utf8');
    let combinedPages = index.replace("<div id='content'></div>", content);
    fs.writeFileSync(`./docs/${page}.html`, combinedPages);
  });

}


// app.use(pageBuilder); // serve html


generateStaticHtml();

app.use(express.static(__dirname + '/docs')); 

app.listen(port, () => console.log(`Example app listening on port ${port}!`));