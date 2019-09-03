window.lazy = {};
window.init = {};

(function(l) {
  const pageMatcher = /([a-z]+)(?:\.html)?$/;;
  const parser = new DOMParser();
  
  const dependancies = {
    skills: [
      ["js/other/tagcanvas.min.js", 'script'],
      ["js/skills.js", 'script'],
      ['css/about.css', 'css'],
    ],
    projects: [
      ['https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js', 'script'],
      ['js/projects.js', 'script'],
      ['css/projects.css', 'css'],
    ],
    home: [
      ['https://cdnjs.cloudflare.com/ajax/libs/animejs/2.0.2/anime.min.js', 'script'],
      ['js/home.js', 'script'],
      ['css/home.css', 'css'],
    ],
    contact: [
      ['js/contact.js', 'script'],
      ['css/contact.css', 'css'],
    ],
    about: [
      ['js/about.js', 'script'],
      ['css/about.css', 'css']
    ]
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
  l.loadDependacies = (pageName) => {
    if ( !(pageName in dependancies)) return Promise.resolve();
    let deps = dependancies[pageName].map(([link, type]) => l.loadResource(link, type) );
    return Promise.all( deps );
  }
  l.initPage = (pageName) => {
    return l.loadDependacies(pageName)
            .then( () => {
              let initialize = window.init[pageName];
              initialize && initialize();
              // console.log("Lazy loading, initialized " + pageName);
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
        // console.log("Font was sync loaded -- " + familyName);
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
              // console.log("Font was async loaded -- " + familyName);
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
          // console.log("LOADED SCRIPT src = " + src)
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
        // console.log("CSS src = " + src + " was sync loaded");
      } else {
        loadedCss[src] = new Promise( (resolve,reject) => {
          let s = document.createElement('link');
          s.setAttribute('href', src);
          s.setAttribute('rel', 'stylesheet');
          s.setAttribute('type', 'text/css')
          s.onload = () => {
            // console.log("LOADED CSS src = " + src);
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

  const found = {};
  l.find = (selector) => {
    if ( !(selector in found) ) {
      found[selector] = document.querySelector(selector);
    }
    return found[selector];
  }

  l.updateContent = async (href) => {
    l.showLoadingWindow();

    let $content = l.find('#content');

    let requestedPage = l.getPageName(href);

    l.loadDependacies(requestedPage);

    let content = await l.getContent(requestedPage);
    $content.innerHTML = ''; //remove current content
    $content.append( ...content);

    l.initPage(requestedPage).then( l.hideLoadingWindow );
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
  l.cacheCurrContent = () => {
    let page = l.getCurrPageName();
    let contents = [...l.find('#content').childNodes];
    cachedContent[page] = Promise.resolve(contents);
  };

  l.getContent = (pageName) => {
    if ( !(pageName in cachedContent)) {
      cachedContent[pageName] = new Promise( async (resolve, reject) => {
        try {
          let doc = await l.loadParsedHtml(pageName);
          // transforming from HTMLCollection to array to be able to cache elements
          // HTMLCollection/NodeList gets updated on .innerHTML = '' and elements get removed
          let content = [...doc.getElementById('content').childNodes];
          resolve(content);
        } catch(e) {
          // resolve(['network error']);
          console.error(e);
        }
      })
    }
    return cachedContent[pageName];
  };
  l.loadParsedHtml = async (href) => {
    let html = await fetch(href).then( res => res.text() );    
    let doc = parser.parseFromString(html, "text/html");
    return doc;
  };

  l.showLoadingWindow = () => {
    l.find('#loading').classList.remove('hide');
    l.find('#content').classList.add('hide');
  };
  l.hideLoadingWindow = () => {
    l.find('#loading').classList.add('hide');
    l.find('#content').classList.remove('hide');
    l.fadeInContent();
  };
  l.fadeInContent = () => {
    let c = l.find('#content').classList;
    let f1 = 'fadeIn';
    let f2 = 'fadeIn2';
    // toggle between fadeIn & fadeIn2 classes (identical)
    // to force animation to execute
    c.replace(f1, f2) || c.replace(f2, f1) || c.add(f1);
  }

  let activeLink = null;
  l.highlightActiveMenu = (href=document.location.pathname) => {
    const $nav = document.getElementById('nav');
    let pageName = l.getPageName(href);
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


  
  l.loadImg = (src) => {
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
    l.navigateToPage(href);
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

  l.getCssVariable = (name) => {
    const bodyStyle = getComputedStyle(document.body);
    let value = bodyStyle.getPropertyValue(name).trim();
    return value;
  };

  const calledOnce = new Map();
  l.callOnce = (...functions) => {
    for( let func of functions) {
      if (calledOnce.has(func)) continue;
      try {
        func();
      } catch(e) {
        console.error(e);
      }
      calledOnce.set(func, true);
    }
  };

  const spinnerHTML = `
    <div class="spinner">
      <div class="blob top"></div>
      <div class="blob bottom"></div>
      <div class="blob left"></div>
      <div class="blob move-blob"></div>
    </div>  
  `;
  l.showSpinner = (parentEl) => {
    l.removeSpinner(parentEl);
    parentEl.insertAdjacentHTML('afterbegin', spinnerHTML);
  };
  l.removeSpinner = (parentEl) => {
    parentEl.querySelectorAll('.spinner').forEach( x => parentEl.removeChild(x));
  }


  const abortableFetch = function(url) {
    const controller = new AbortController();
    const signal = controller.signal;
    return {
      ready: fetch( url, {signal}),
      abort: () => controller.abort()
    };
  };
  l.loadImgWithTimeout = (url, timeout) => {
    let promiseUrl;
    try { // making sure fetch abort is supported
      let fetched = abortableFetch(url);
      setTimeout( fetched.abort, timeout );
      promiseUrl = fetched.ready
        .then( res => res.blob() )
        .then( blob => URL.createObjectURL(blob))
    } catch(e) {
      console.log('Abortable fetch is not supported');
      promiseUrl = l.loadImg(url).then( () => url );
    }
    return promiseUrl;
  };

})(window.lazy);
