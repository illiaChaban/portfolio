(function() {
  const lazyLoadConfig = {
    skills: {
      js: ["js/skills/tagcanvas.min.js", "js/skills/skillsCloud.js"],
      fonts: ['Special Elite'],
      initializer: 'initSkillsCloud'
    }
  };
  let loadedFonts = {};
  let loadedScripts = {};
  
  window.lazyLoad = {
    pageResources(pageName) {
      let {js=[], fonts=[], initializer} = lazyLoadConfig[pageName];
      return Promise.all([
        ...js.map( src => lazyLoad.script(src)),
        ...fonts.map( font => lazyLoad.font(font))
      ]).then( () => {
        window[initializer] && window[initializer]();
        console.log("Lazy loading, initialized " + pageName);
      }).catch( console.error );
    },
    font(familyName) {
      // starting to load the font and returning a promise
      if ( !(familyName in loadedFonts) ) {
        let escapedSpaceFont = familyName.replace(/\s/g, "+");
        let fontSyncLoaded = document.querySelector(`link[href*="fonts.googleapis.com"][href*="${escapedSpaceFont}"]`);
        if (fontSyncLoaded) {
          loadedFonts[familyName] = Promise.resolve();
          console.log("Font was sync loaded -- " + familyName);
        } else {
          loadedFonts[familyName] = new Promise( async (resolve,reject) => {
            await lazyLoad.script("https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js");
            WebFont.load({
              google: {
                families: [ familyName ]
              },
              active() {
                resolve();
                console.log("Font was async loaded -- " + familyName);
              },
              inactive: () => reject("--inactive")
            });
          }).catch( (e) => console.warn("Failed to load font " + familyName, e) );
        }
      }
      return loadedFonts[familyName];
    },
    script( src ) {
      if ( !(src in loadedScripts) ) {
        loadedScripts[src] = new Promise( (resolve,reject) => {
          let s = document.createElement('script');
          s.setAttribute('src', src);
          s.setAttribute('type', 'text/javascript');
          s.onload = () => {
            console.log("LOADED SCRIPT src = " + src)
            resolve()
          };
          s.onerror = reject;
          document.querySelector('body').appendChild(s);
        })
      }
      return loadedScripts[src];
    },
    content: async ({href, pushHistory}) => {
      let html = await fetch(href).then( res => res.text());
      lazyLoad.updateElementFromHtml('content', html);
      pushHistory && window.history.pushState({html}, "", href);
    },
    updateElementFromHtml(elementId, htmlString) {
      const $content = document.getElementById(elementId);
    
      let newDocument = new DOMParser().parseFromString(htmlString, "text/html");
      $content.innerHTML = newDocument.getElementById('content').innerHTML;
    
      // innerHTML / reappending existing script doesn't execute the script
      // that's why we need to execute it manually if any
      const initializer = $content.querySelector('script#initializer');
      initializer && Function(initializer.textContent)();
    }
  };
})();
