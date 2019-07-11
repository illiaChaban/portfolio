(function() {
  function bindMenu() {
    document.getElementById("menu").addEventListener('click', async (e) => {
      // console.log(e)
      const el = e.target;
      if (el && el.tagName === 'A') {
        e.preventDefault();
        let href = el.getAttribute('href');

        lazy.updateContent(href);
        // updating location.href without reloading
        window.history.pushState(null, "", href); 

        // console.log(cachedContent)

        // ADD --> If curr location is the same, no update needed
        // ADD --> reuse loaded html ?
      }
    });
  };
  
  function bindHistoryNavigation() {
    window.onpopstate = (e) => {
      // console.log("pop state",{e});
      lazy.updateContent(document.location.pathname.slice(1))
    }
  };

  function preloadExtraFiles() {
    // preload specific fonts, scripts 
    // setTimeout( () => {}, 0)
  }

  function redirectToHomeFromIndex() {
    let path = window.location.pathname.split("/");
    let pageHref = path[path.length-1];
    let indexPathes = ['', 'index.html', 'index'];
    if (indexPathes.includes( pageHref )) {
      // redirect to home from html
      // path[path.length-1] = 'home';
      // location.pathname = path.join("/");

      lazy.updateContent('home.html');
      // updating location.href without reloading
      window.history.replaceState(null, "", 'home'); 
      // console.log(path.join("/"));
    }
    // return pageHref;
  }



  utils.onDocumentReady( () => {
    redirectToHomeFromIndex();
    bindMenu();
    bindHistoryNavigation();
    preloadExtraFiles();
  });
})();







