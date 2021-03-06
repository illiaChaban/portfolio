(function() {
  // ****************************************************
  class TextTyper {
    constructor(el, minTypingTime=30, randomTypingTime=175) {
      this.container = el;
      this.cursorBlinkerTimeoutId;
      this.waitCharacters = '.?!';

      this.minTypingTime = minTypingTime;
      this.randomTypingTime = randomTypingTime;

      this.stopAnimation = false;
      this.currPromiseChain = Promise.resolve();
    }

    type(text) {
      this.addCursor();
      for( let char of text ) { 
        this.typeLetter(char);
        if (this.waitCharacters.includes(char)) this.wait(1000);
        if (char === ',') this.wait(300);
      }
      return this;
    }

    typeLetter(char) {
      this.chain( () => new Promise( resolve => {

        setTimeout( () => {
          this.container.innerText += char;
          this.stopCursorBlinking();
          resolve();
        }, this.getRandomTimeout());
      }));
      return this;
    }

    getRandomTimeout() {
      // simulates real person's typing
      return Math.random() * this.randomTypingTime + this.minTypingTime; 
    }

    stopCursorBlinking() {
      this.container.classList.add('typing');
      clearTimeout( this.cursorBlinkerTimeoutId );
      this.cursorBlinkerTimeoutId = setTimeout( () => {
        this.container.classList.remove('typing');
      }, 200);
    }

    remove(num) {
      for( let i = 0; i < num; i++ ) {
        this.removeLetter();
      }
      return this;
    }

    removeLetter() {
      this.chain( () => new Promise( resolve => {
        setTimeout( () => {
          let currText = this.container.innerText;
          this.container.innerText = currText.slice( 0, currText.length - 1);
          this.stopCursorBlinking();
          resolve();
        }, this.getRandomTimeout() / 2.5);
        // removing characters is usually much faster than typing

      }))
      return this;
    }

    chain( callback, cancelable=true ) {
      this.currPromiseChain = this.currPromiseChain.then( () => {
        if (cancelable && this.stopAnimation) return;
        return callback()
      });
      return this;
    }
    wait( time ) {
      this.chain( () => new Promise( resolve => {
        setTimeout(resolve, time)
      }));
      return this;
    }
    clear() {
      this.chain( () => this.container.innerText = '');
      return this;
    }
    stop() {
      this.stopAnimation = true;
      this.chain( () => { this.stopAnimation = false}, false );
      return this;
    }
    clearNow() {
      this.stop().clear();
      return this;
    }

    addCursor() {
      this.chain( () => this.container.classList.add('text-cursor'));
      return this;
    }

    removeCursor() {
      this.chain( () => this.container.classList.remove('text-cursor'));
      return this;
    }

  }

// ****************************************************
  const artMap = [
    {
      imgUrl: 'imgs/quotes/simpsons.svg',
      colors: ['var(--color-main)', 'black', '#afadad', 'var(--color-highlight)'],
      
      // imgUrl: 'imgs/quotes/simpsons1.svg',
      // colors: ['black', 'var(--color-main)', '#afadad'],
      quote: ["Find what you love and follow it to glory.", "- The Simpsons"],
    },
    {
      imgUrl: 'imgs/quotes/todd.svg',
      colors: ['black', 'var(--color-main)', 'var(--color-subtle)', 'var(--color-highlight)'],
      quote: ["I never know if I can handle anything! That’s what makes my life so exciting.", "- Todd from BoJack Horseman"],
    },
    {
      imgUrl: 'imgs/quotes/feynman.svg',
      colors: ['var(--color-main)', '#afadad', 'black'],
      // quote: ["I'm smart enough to know that I'm dumb.", "- Richard Feynman"],
      quote: ["The first principle is that you must not fool yourself and you are the easiest person to fool.", "- Richard Feynman"]
    },
    {
      imgUrl: 'imgs/quotes/gandhi1.svg', 
      colors: ['black', 'var(--color-main)', '#afadad'], 
      quote: ["A man is but the product of his thoughts. What he thinks, he becomes.", "- Mahatma Gandhi"]
    },
    {
      imgUrl: 'imgs/quotes/lee7.svg',
      colors: ['black', 'var(--color-main)', '#afadad'],
      quote: ["Knowing is not enough, we must apply. Willing is not enough, we must do.", "- Bruce Lee"],
    },
  ];

  class WisdomArt {
    constructor() {
      this.currentArtCount = 0;
      this.$art = document.querySelector('.art');
      
      // initializing typers
      const $quote = this.$art.querySelector('#quote');
      const $quotation = $quote.querySelector('.quotation > span');
      const $author = $quote.querySelector('.author');
      this.typer1 = new TextTyper($quotation, 15, 70);
      this.typer2 = new TextTyper($author, 20, 80);

      // img updater
      this.$imgContainer = this.$art.querySelector('#img');
      // this.img = new SvgUpdater($imgContainer);
  
      this.updateArt();
      this.bindArtButton();
    }

    typeQuote() {
      const [quotation, author] = artMap[this.currentArtCount].quote;

      this.typer1.clearNow();
      this.typer2.clearNow().removeCursor();

      this.typer1
        .addCursor()
        .type(quotation)
        .removeCursor()
        .chain( () => {
          this.typer2
            .addCursor()
            .type(author)
        })
    };


    colorSvgOnce(svgEl, colors) {
      if (svgEl.getAttribute('data-colored')) return;

      // svg colors are saved in css variables at svg element levet
      // to make it easy to update & experiment with colors
      colors.forEach( (color,i) => {
        svgEl.style.setProperty(`--color-${i}`, `${color}`);
      });

      svgEl.querySelectorAll('path').forEach( (path, i) => {
        path.setAttribute('fill', `var(--color-${i})`);
      });

      svgEl.setAttribute('data-colored', true); // flag
    };

    async updateImg() {
      const artCount = this.currentArtCount;
      const {imgUrl, colors} = artMap[artCount];
      lazy.showSpinner(this.$imgContainer);
      let svgEl = await lazy.loadSvg(imgUrl);
      this.colorSvgOnce( svgEl, colors );
      // if user clicked through the art before it's loaded, skip
      if (this.currentArtCount !== artCount) return;
      this.$imgContainer.innerHTML = '';
      this.$imgContainer.append( svgEl );
    }


    updateArt() {
      this.updateImg();
      this.typeQuote();
    }

    bindArtButton() {
      this.$art.querySelector('.btn').addEventListener('click', () => {
        this.currentArtCount = (this.currentArtCount + 1) % artMap.length;
        this.updateArt();
        gtagEvent('wisdom_button_click');
      });
    };
  }


  let scramble;
  const getScramble = () => {
    if (!scramble) scramble = new TextScramble('.h1-tags');
    return scramble;
  }

  const initiazeQuotes = () => new WisdomArt();

  window.init.about = () => {
    lazy.callOnce( initiazeQuotes );
    getScramble().animate();
  }
})();




