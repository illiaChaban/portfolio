(function() {
  function bindMenu() {
    document.getElementById("menu").addEventListener('click', async (e) => {
      // console.log(e)
      const el = e.target;
      // console.log( el.parentElement.tagName)
      let link = el.tagName === 'A' ? el : el.closest("#menu a");
      if (!link) return;
      // console.log(link)
      e.preventDefault();
      let href = link.getAttribute('href');
      // don't update if user clicks on the active menu link
      if (lazy.getCurrPageName() === lazy.getPageName(href)) return;

      lazy.updateContent(href);
      // updating location.href without reloading
      window.history.pushState(null, "", href); 
      highlightActiveMenu(link);


      // console.log(cachedContent)

      // ADD --> If curr location is the same, no update needed
      // ADD --> reuse loaded html ?
    });
  };
  
  function bindHistoryNavigation() {
    window.onpopstate = () => 
      lazy.updateContent(document.location.pathname);
  };

  function preloadExtraFiles() {
    // preload specific fonts, scripts 
    // setTimeout( () => {}, 0)
  };

  function redirectToHomeFromIndex() {
    let path = window.location.pathname.split("/");
    let pageHref = path[path.length-1];
    let indexPathes = ['', 'index.html', 'index'];
    if (indexPathes.includes( pageHref )) {
      lazy.updateContent('home.html');
      window.history.replaceState(null, "", 'home'); 
    }
  };

  const $nav = document.getElementById('nav');
  let activeLink = null;
  function highlightActiveMenu(currLink=null) {
    if (!currLink) {
      let currPage = lazy.getCurrPageName();
      currLink = $nav.querySelector(`a[href^=${currPage}]`);
    }
    if (activeLink) activeLink.classList.remove('active');
    currLink.classList.add('active');
    activeLink = currLink;
  };




  utils.onDocumentReady( () => {
    highlightActiveMenu();
    lazy.cacheCurrContent();
    redirectToHomeFromIndex();
    bindMenu();
    bindHistoryNavigation();
    lazy.initPage( lazy.getCurrPageName() );
    preloadExtraFiles();
  });
})();







