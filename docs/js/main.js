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



  // Original text scramble is taken from codepen. Pen by Lorenzo
  // https://codepen.io/lollocll/pen/qPmLMr
  // Thanks! 
  // Was updated by me for my needs :)
  window.TextScramble = class TextScramble {
    constructor(selector, config={}) {
      this.el = document.querySelector(selector);
      this.doodles = '!<>-_\\/[]{}—=+*^?#________'
      this.update = this.update.bind(this);
      this.animate = this.animate.bind(this);

      // configuration
      this.phrases = config.phrases || [ this.el.innerText ];
      this.infinite = config.infinite || false;
      this.interval = config.interval || 2500;
      this.currIndex = 0;
    }
    setText(newText) {
      const oldText = this.el.innerText
      const length = Math.max(oldText.length, newText.length)
      const promise = new Promise((resolve) => this.resolve = resolve)
      this.queue = []
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || ''
        const to = newText[i] || ''
        const start = Math.floor(Math.random() * 40)
        const end = start + Math.floor(Math.random() * 40)
        this.queue.push({ from, to, start, end })
      }
      cancelAnimationFrame(this.frameRequest)
      this.frame = 0
      this.update()
      return promise
    }
    update() {
      let output = ''
      let complete = 0
      for (let i = 0, n = this.queue.length; i < n; i++) {
        let { from, to, start, end, char } = this.queue[i]
        if (this.frame >= end) {
          complete++
          output += to
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = this.getDoodle();
            this.queue[i].char = char
          }
          output += `<span class='doodle'>${char}</span>`
        } else {
          output += from
        }
      }
      this.el.innerHTML = output
      if (complete === this.queue.length) {
        this.resolve()
      } else {
        this.frameRequest = requestAnimationFrame(this.update)
        this.frame++
      }
    }
    getDoodle() {
      return this.doodles[Math.floor(Math.random() * this.doodles.length)]
    }
    animate() {
      if (this.currIndex < this.phrases.length) {
        this.setText(this.phrases[this.currIndex]).then(() => {
          this.currIndex++;
          if (this.infinite) this.currIndex %= this.phrases.length;
          setTimeout( this.animate, this.interval);
        })
      } else {
        // reset animator till next call
        this.currIndex = 0;
      }
    }
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







