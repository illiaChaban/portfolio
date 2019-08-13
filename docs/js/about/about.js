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

  const colorSvg = (svgEl, colors) => {
    colors.forEach( (color,i) => {
      svgEl.style.setProperty(`--color-${i}`, `${color}`);
    });

    svgEl.querySelectorAll('path').forEach( (path, i) => {
      path.setAttribute('fill', `var(--color-${i})`);
    })
  }


  const artMap = [
    {
      imgUrl: 'imgs/quotes/feynman.svg',
      colors: ['var(--color-bright)', '#afadad', 'black'],
      // quote: ["I'm smart enough to know that I'm dumb.", "- Richard Feynman"],
      quote: ["The first principle is that you must not fool yourself and you are the easiest person to fool.", "- Richard Feynman"]
    },
    {
      imgUrl: 'imgs/quotes/gandhi1.svg', 
      colors: ['black', 'var(--color-bright)', '#afadad'], 
      quote: ["A man is but the product of his thoughts. What he thinks, he becomes.", "- Mahatma Gandhi"]
    },
    {
      imgUrl: 'imgs/quotes/lee7.svg',
      colors: ['black', 'var(--color-bright)', '#afadad'],
      quote: ["Knowing is not enough, we must apply. Willing is not enough, we must do.", "- Bruce Lee"],
    },
    {
      imgUrl: 'imgs/quotes/simpsons.svg',
      colors: ['var(--color-bright)', 'black', '#afadad'],
      
      // imgUrl: 'imgs/quotes/simpsons1.svg',
      // colors: ['black', 'var(--color-bright)', '#afadad'],
      quote: ["Find what you love and follow it to glory.", "- Simpsons"],
    },
    // {
    //   imgUrl: 'imgs/rv-vector1.svg',
    //   colors: ['var(--color-bright)', 'black', 'var(--color-orange)'],
    //   quote: ["Find what you love and follow it to glory.", "- Simpsons"],
    // },
  ]



  lazy.onDocumentReady( () => {
    const $art = document.querySelector('.art');
    const $imgContainer = $art.querySelector('#img');

    const $quote = document.getElementById('quote');
    const $quotation = $quote.querySelector('.quotation > span');
    const $author = $quote.querySelector('.author');
    // const speed = [15, 70]; // 20, 80
    const typer1 = new TextTyper($quotation, 15, 70);
    const typer2 = new TextTyper($author, 20, 80);

    const typeQuote = ([quotation, author]) => {
      // $quote.querySelectorAll('.text-cursor').forEach( x => x.classList.remove('text-cursor'));

      typer1.clearNow();
      typer2.clearNow().removeCursor();

      typer1
        .addCursor()
        .type(quotation)
        .removeCursor()
        .chain( () => {
          typer2
            .addCursor()
            .type(author)
        })
    };


    const loadImg = async (url, colors) => {
      let svgEl = await lazy.loadSvg(url);
      $imgContainer.innerHTML = '';
      $imgContainer.append( svgEl );
      colorSvg( svgEl, colors );
    }

    const updateArt = (count) => {
      const {imgUrl, colors, quote} = artMap[count];
      loadImg( imgUrl, colors );
      typeQuote( quote );
    }


    let artCount = 0;
    $art.querySelector('.btn').addEventListener('click', () => {
      artCount = (artCount + 1) % artMap.length;
      updateArt( artCount );
    });

    const scramble = new TextScramble('.h1-tags');

    window.initAbout = () => {
      updateArt( artCount );
      scramble.animate();
    }

  });

})();




