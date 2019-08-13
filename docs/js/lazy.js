window.lazy = {};

(function(l) {
  const pageMatcher = /([a-z]+)(?:\.html)?$/;;
  const parser = new DOMParser();
  // const skillCloudFont = 'Special Elite';
  // const skillCloudFont = 'Courier';
  const pageConfig = {
    skills: {
      dependancies: [
        ["js/skills/tagcanvas.min.js", 'script'],
        ["js/skills/skills.js", 'script'],
        ['css/about.css', 'css'],
        // [skillCloudFont, 'font']
      ],
      initializer: 'initSkills', 
      // args: [skillCloudFont]
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
        ['js/fonts/fonts.js', 'script'],
        ['css/fonts.css', 'css'],
        // ['Amatic SC', 'font'],
        // ['Sacramento', 'font'],
      ],
      initializer: 'initFonts'
    },
    home: {
      dependancies: [
        ['https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js', 'script'],
        ['js/home/home.js', 'script'],
        ['css/home.css', 'css'],
      ],
      initializer: 'initHome'
    },
    contact: {
      dependancies: [
        ['js/contact/contact.js', 'script'],
        ['css/contact.css', 'css'],
      ],
      initializer: 'initContact'
    },
    about: {
      dependancies: [
        ['js/about/about.js', 'script'],
        ['css/about.css', 'css']
      ],
      initializer: 'initAbout'
    },
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

  // has a bug. If loading 2 fonts asynchronously in a row the second promise isn't being resolved
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
  l.updateContent = async (href) => {
    let currContent = document.getElementById('content');
    currContent.classList.add('hide');

    l.showLoadingWindow();
    let requestedPage = l.getPageName(href);

    if ( !(requestedPage in cachedContent)) {
      let doc = await l.loadParsedHtml(href);
      l.cacheContent(requestedPage, doc);
    }
    currContent.innerHTML = ''; //remove current content
    currContent.append( ...cachedContent[requestedPage]);
    l.initPage(requestedPage).then( () => {
      l.hideLoadingWindow();
      currContent.classList.remove('hide');
    });
  };

  // caching values to avoid executing the function with the same
  // arguments multiple times
  let cachedPageNames = {}; 
  l.getPageName = (href) => {
    if ( !(href in cachedPageNames)) {
      let path = href.split("/");
      let lastPath = path[path.length-1];
      cachedPageNames[href] = lastPath === '' ? 
        'index':
        href.match( pageMatcher )[1];
    }
    return cachedPageNames[href];
  };
  l.getCurrPageName = () => l.getPageName(document.location.pathname);
  l.cacheContent = (page, doc) => {
    // transforming from HTMLCollection to array to be able to cache elements
    // HTMLCollection/NodeList gets updated on .innerHTML = '' and elements get removed
    cachedContent[page] = [...doc.getElementById('content').childNodes];
  };
  l.cacheCurrContent = () => l.cacheContent( l.getCurrPageName(), document );

  l.loadParsedHtml = async (href) => {
    let html = await fetch(href).then( res => res.text() );    
    let doc = parser.parseFromString(html, "text/html");
    return doc;
  };

  l.showLoadingWindow = () => document.getElementById('loading').classList.remove('hide');
  l.hideLoadingWindow = () => document.getElementById('loading').classList.add('hide');

  let activeLink = null;
  l.highlightActiveMenu = (href=document.location.pathname) => {
    const $nav = document.getElementById('nav');
    let pageName = lazy.getPageName(href);
    let currLink = $nav.querySelector(`a[href^=${pageName}]`);
    if (activeLink) activeLink.classList.remove('active');
    if (currLink) {
      currLink.classList.add('active');
      activeLink = currLink;
    }
  };

  l.navigateToPage = (href, updateUrl=true) => {
    l.updateContent(href);
    l.highlightActiveMenu(href);

    // updating location.href without reloading
    updateUrl && window.history.pushState(null, "", href); 
  };


  
  l.loadImg = src => {
    let img = new Image();
    let promise = new Promise( (resolve, reject) => {
      img.onload = () => resolve(img);
      img.onerror = reject;
    })
    img.src = src;
    return promise;
  };

  const loadedImgs = {};
  l.loadSvg = src => {
    if ( !(src in loadedImgs) ) {
      loadedImgs[src] = new Promise( async (resolve, reject) => {
        try {
          let svgText = await fetch(src).then( res => res.text() );
          const parsed = parser.parseFromString(svgText, 'image/svg+xml');
          const svgEl = parsed.querySelector('svg');
          resolve(svgEl);
        } catch(e) {
          console.warn(e);
          reject();
        }
      })
    }
    return loadedImgs[src];
};

  l.onDocumentReady = ( callback ) => {
    // console.log("ON DOCUMENT READY CALLED", document.readyState, {cb: callback.toString()})
    document.readyState === 'loading' ? 
      window.addEventListener('DOMContentLoaded', callback ) :
      callback();
  };

  l.navigateToPageFromLink = (e) => {
    e.preventDefault();
    let href = e.target.getAttribute('href');
    lazy.navigateToPage(href);
  };


  // vanilla JS window width and height
	// l.getWindowWidthHeight = () => {
	// 	var w=window,
	// 	d=document,
	// 	e=d.documentElement,
	// 	g=d.getElementsByTagName('body')[0],
	// 	x=w.innerWidth||e.clientWidth||g.clientWidth,
	// 	y=w.innerHeight||e.clientHeight||g.clientHeight;
	// 	return [x,y];
	// };


})(window.lazy);
