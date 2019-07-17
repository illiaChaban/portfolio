window.lazy = {};

(function(l) {
  const pageMatcher = /([a-z]+)(?:\.html)?$/;;
  const parser = new DOMParser();
  const skillCloudFont = 'Special Elite';
  const pageConfig = {
    skills: {
      dependancies: [
        ["js/skills/tagcanvas.min.js", 'script'],
        ["js/skills/skillsCloud.js", 'script'],
        [skillCloudFont, 'font']
      ],
      initializer: 'initSkillsCloud', // add arguments !!!! (text font),
      args: [skillCloudFont]
    },
    // projects: {
    //   dependancies: [
    //     ['https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js', 'script'],
    //     ['js/projects/projects.js', 'script'],
    //     ['css/projects.css', 'css'],
    //     ['Sacramento', 'font'],
    //     ['Amatic SC', 'font']
    //   ],
    //   initializer: 'initProjects'
    // },
    fonts: {
      dependancies: [
        ['https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js', 'script'],
        ['js/projects/fonts.js', 'script'],
        ['css/fonts.css', 'css'],
        ['Sacramento', 'font'],
        ['Amatic SC', 'font']
      ],
      initializer: 'initFonts'
    }
  };
  let loadedFonts = {};
  let loadedScripts = {};
  let loadedCss = {};
  let cachedContent = {};

  
  l.loadResource = (hrefOrName, type) => {
    const switcher = {
      'font' : l.loadFont,
      'script': l.loadScript,
      'css': l.loadCss
    };
    let loader = switcher[type];
    return loader(hrefOrName); 
  };
  l.initPage = (pageName) => {

    if ( !(pageName in pageConfig)) return Promise.resolve();
    let {dependancies, initializer, args=[]} = pageConfig[pageName];
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
  l.loadCss = (src) => {
    if ( !(src in loadedCss) ) {
      if (document.querySelector(`link[href='${src}']`)) {
        loadedCss[src] = Promise.resolve();
        console.log("CSS src = " + src + " was sync loaded");
      } else {
        loadedCss[src] = new Promise( (resolve,reject) => {
          let s = document.createElement('link');
          s.setAttribute('href', src);
          s.setAttribute('rel', 'stylesheet');
          s.setAttribute('type', 'text/css')
          s.onload = () => {
            console.log("LOADED CSS src = " + src);
            // console.log(s.sheet.cssRules[0].cssText)
            resolve()
          };
          s.onerror = reject;
          document.querySelector('head').appendChild(s);
        })
      }
    }
    return loadedCss[src];
  };
  l.getPageName = (href) => {
    let path = href.split("/");
    let lastPath = path[path.length-1];
    if (lastPath === '') return 'index';
    return href.match( pageMatcher )[1];
  };
  l.updateContent = async (href) => {
    let requestedPage = l.getPageName(href);
    if ( !(requestedPage in cachedContent)) cachedContent[requestedPage] = await l.loadContent(href);
    document.getElementById('content').innerHTML = cachedContent[requestedPage];
    l.initPage(requestedPage);
  };
  l.getCurrPageName = () => lazy.getPageName(document.location.pathname);
  l.cacheCurrContent = () => {
    cachedContent[l.getCurrPageName()] = document.getElementById('content').innerHTML;
  };
  l.loadContent = async (href) => {
    let html = await fetch(href).then( res => res.text() );    
    let doc = parser.parseFromString(html, "text/html");
    return doc.getElementById('content').innerHTML;;
  };

  // l.cachedContent = cachedContent; // REMOVE IT

})(window.lazy);
