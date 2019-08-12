(function() {
  function bindMenu() {
    document.getElementById("menu").addEventListener('click', async (e) => {
      const el = e.target;
      let link = el.tagName === 'A' ? el : el.closest("#menu a");
      if (!link) return;
      e.preventDefault();
      let href = link.getAttribute('href');
      // don't update if user clicks on the active menu link
      if (lazy.getCurrPageName() === lazy.getPageName(href)) return;
      lazy.navigateToPage(href);

    });
  };
  
  function bindHistoryNavigation() {
    window.onpopstate = () => 
      lazy.navigateToPage(document.location.pathname, false /* dont update url */);
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
      lazy.navigateToPage('home.html', false);
      window.history.replaceState(null, "", 'home'); 
    }
  };



  function initCurrPage() {
    const $content = document.getElementById('content');
    $content.classList.add('hide');
    lazy.showLoadingWindow();

    lazy.cacheCurrContent();
    const currPage = lazy.getCurrPageName();
    lazy.initPage( currPage ).then( () => {
      lazy.hideLoadingWindow();
      $content.classList.remove('hide');
    });
  };

  function bindButtons() {
    document.body.addEventListener('mousemove', e => {
      let btn = e.target;
      if (btn.matches('.btn') ) {
        // initiating gradient movement on hover
        // btn.setAttribute('style', `--mouse-pos-x: ${e.offsetX}px; --mouse-pos-y: ${e.offsetY}px;`);
        btn.style.setProperty('--mouse-pos-x', `${e.offsetX}px`);
        btn.style.setProperty('--mouse-pos-y', `${e.offsetY}px`);
      }
    })
  }

  async function initParticles() {
    // renamed files to stop adblocker from blocking the script
    await lazy.loadScript('js/other/part1cl3sLibrary.js');
    lazy.loadScript('js/other/part1cl3s.js');
  }




  lazy.onDocumentReady( () => {
    redirectToHomeFromIndex();
    lazy.highlightActiveMenu();

    bindMenu();
    bindHistoryNavigation();
    bindButtons();

    initCurrPage();

    // initParticles();

    preloadExtraFiles();
  });
})();







