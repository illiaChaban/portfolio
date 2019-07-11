const express = require('express');
const fs = require('fs');

const app = express();
const port = 5000;
// const pageBuilder = require("./pageBuilderRoute");

// const bodyparser = require('body-parser');
// app.use(bodyparser.text());
// app.use(bodyparser.json());


function generateStaticHtml() {
  let files = fs.readdirSync("./html");
  files = files.filter( x => x !== 'index.html');
  // console.log(files)

  let index = fs.readFileSync('./html/index.html', 'utf8');
  fs.writeFileSync(`./docs/index.html`, index);

  files.forEach( file => {
    let content = fs.readFileSync(`./html/${file}`, 'utf8');
    // console.log(content)
    let combinedPages = index.replace("<div id='content'></div>", content);
    fs.writeFileSync(`./docs/${file}`, combinedPages);
  });

  console.log('rewritten HTML files successfully');
}


// app.use(pageBuilder); // serve html


generateStaticHtml();

app.use(express.static(__dirname + '/docs', {
  extensions: ['html'] // remove the need of .html extension in the browser
})); 

app.listen(port, () => console.log(`Example app listening on port ${port}!`));