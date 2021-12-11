To start a server that will listen for html changes run
```
nodemon --ext js,html --ignore 'docs/*'
```

Start a server and navigate to localhost:5000


Do not update html files in the docs/ folder directly. Develop in the html/ folder. The server will make sure that header and other parts of the pages are shared. It's here just to avoid copy/pasting of the shared parts
