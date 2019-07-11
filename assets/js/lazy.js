window.lazy = {};

(function(l) {
  const pageMatcher = /([a-z]+)(?:\.html)?$/;
  const parser = new DOMParser();
  const skillCloudFont = 'Special Elite';
  const lazyLoadConfig = {
    skills: {
      dependancies: [
        ["js/skills/tagcanvas.min.js", 'script'],
        ["js/skills/skillsCloud.js", 'script'],
        [skillCloudFont, 'font']
      ],
      initializer: 'initSkillsCloud', // add arguments !!!! (text font),
      args: [skillCloudFont]
    }
  };
  let loadedFonts = {};
  let loadedScripts = {};
  let cachedContent = {};

  
  l.loadResource = (hrefOrName, type) => {
    const switcher = {
      'font' : l.loadFont,
      'script': l.loadScript
    }
    let loader = switcher[type];
    return loader(hrefOrName); 
  };
  l.loadPageResources = (pageName) => {

    let {dependancies, initializer, args=[]} = lazyLoadConfig[pageName];
    let loadedDependacies = dependancies.map(([link, type]) => l.loadResource(link, type) );

    return Promise.all( loadedDependacies )
            .then( () => {
              window[initializer] && window[initializer](...args);
              console.log("Lazy loading, initialized " + pageName);
            }).catch( console.error );
  };
  l.loadFont = (familyName) => {
    // starting to load the font and returning a promise
    if ( !(familyName in loadedFonts) ) {
      let escapedSpaceFont = familyName.replace(/\s/g, "+");
      let fontSyncLoaded = document.querySelector(`link[href*="fonts.googleapis.com"][href*="${escapedSpaceFont}"]`);
      if (fontSyncLoaded) {
        loadedFonts[familyName] = Promise.resolve();
        console.log("Font was sync loaded -- " + familyName);
      } else {
        loadedFonts[familyName] = new Promise( async (resolve,reject) => {
          // adjustment for slow network or not existing font family
          setTimeout( () => reject("loading cancelled - slow network or bad request"), 3000 );
          await l.loadScript("https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js");

          WebFont.load({
            google: {
              families: [ familyName ]
            },
            active() {
              resolve();
              // clearTimeout(timeout);
              console.log("Font was async loaded -- " + familyName);
            },
            inactive: () => reject("inactive")
          });
        }).catch( (e) => (console.warn(`Failed to load font ${familyName} --`, e), e) );
      }
    }
    return loadedFonts[familyName];
  };
  l.loadScript = ( src ) => {
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
  };
  l.getPageName = (href) => href.match( pageMatcher )[1],
  l.updateContent = async (href) => {
    const $content = document.getElementById('content');

    // cache curr content
    let currPage = l.getPageName(document.location.pathname);
    cachedContent[currPage] = $content.innerHTML;

    // console.log(cachedContent)
    let requestedPage = l.getPageName(href);
    let newContentHtml = cachedContent[requestedPage] || await l.loadContent(href);
    $content.innerHTML = newContentHtml;
    // innerHTML / reappending existing script doesn't execute the script
    // that's why we need to execute it manually if any
    const initializer = $content.querySelector('script#initializer');
    initializer && Function(initializer.textContent)();
  };
  l.loadContent = async (href) => {
    let html = await fetch(href).then( res => res.text() );    
    let doc = parser.parseFromString(html, "text/html");
    return doc.getElementById('content').innerHTML;
  }

})(window.lazy);
