(function() {
  function bindMenu() {
    document.getElementById("menu").addEventListener('click', async (e) => {
      // console.log(e)
      const el = e.target;
      if (el && el.tagName === 'A') {
        e.preventDefault();
        let href = el.getAttribute('href');
        lazyLoad.content({href, pushHistory: true});

        // ADD --> If curr location is the same, no update needed
      }
    });
  };
  
  function bindHistoryNavigation() {
    window.onpopstate = (e) => {
      console.log("pop state",{e});
      if (e.state) {
        // console.log("i have state ", e.state)
        let html = e.state.html;
        lazyLoad.updateElementFromHtml('content', html);
      } else {
        // console.log('I don\'t have state, loading from ', document.location.pathname);
        lazyLoad.content({href: document.location.pathname, pushHistory:false});
      }
    }
  };

  utils.onDocumentReady( () => {
    bindMenu();
    bindHistoryNavigation();
  });
})();







