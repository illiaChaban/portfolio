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


  utils.onDocumentReady( () => {
    bindMenu();
    bindHistoryNavigation();
    preloadExtraFiles();
  });
})();







