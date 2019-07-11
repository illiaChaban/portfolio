const { Router } = require('express');
const fs = require('fs');
// const path = require('path');
const promisify = require("util").promisify;
const readFile = promisify(fs.readFile);

const router = new Router();


router.get(/(\w+)\.html/, async (req, res) => {
  let page = req.params[0];
  console.log("serving html for page -- " + page);
  if (page === 'index') return res.redirect("home.html");

  // const pagePath = path.resolve('./html', page + ".html");
  // console.log({pagePath, page });

  try {
    let index = await readFile('./html/index.html', 'utf8');
    let content = await readFile(`./html/${page}.html`, 'utf8');

    let combinedPages = index.replace("<div id='content'></div>", content);
    res.send( combinedPages );
  } catch(err) {
    console.error('Something went wrong:', err);
    res.status(500).send('Oops, better luck next time!');
  }
});

module.exports = router;