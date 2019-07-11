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
    window.onpopstate = () => 
      lazy.updateContent(document.location.pathname);
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
      lazy.updateContent('home.html');
      window.history.replaceState(null, "", 'home'); 
    }
  }




  utils.onDocumentReady( () => {
    lazy.cacheCurrContent();
    redirectToHomeFromIndex();
    bindMenu();
    bindHistoryNavigation();
    lazy.initPage( lazy.getCurrPageName() );
    preloadExtraFiles();
  });
})();







