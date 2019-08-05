(function(){
  
// Text scramble is taken from codepen. Pen by Lorenzo
// https://codepen.io/lollocll/pen/qPmLMr
// Thanks! 

class TextScramble {
  constructor(el) {
    this.el = el
    this.chars = '!<>-_\\/[]{}—=+*^?#________'
    this.update = this.update.bind(this)
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
          char = this.randomChar()
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
  randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)]
  }
}


const phrases = [
  'Hello friend,',
  "Let's build something great!"
]

const el = document.querySelector('.scramble-text');
const fx = new TextScramble(el);

const animateScramble = (c = {infinite: true, interval: 2500}) => {
  if (c.currIndex === undefined) c.currIndex = 0;

  if (c.currIndex < phrases.length) {
    fx.setText(phrases[c.currIndex]).then(() => {
      c.currIndex++;
      if (c.infinite) c.currIndex %= phrases.length;
      setTimeout( () => animateScramble(c), c.interval)
    })
  }
}

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
    for( let char of text ) { 
      this.typeLetter(char);
      if (this.waitCharacters.includes(char)) this.wait(1000);
      if (char === ',') this.wait(300);
    }
    return this;
  }

  typeLetter(char) {
    this.chain( () => new Promise( resolve => {
      if (this.stopAnimation) return resolve();

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
      if (this.stopAnimation) return resolve();

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

  chain( callback ) {
    this.currPromiseChain = this.currPromiseChain.then( callback );
    return this;
  }
  wait( time ) {
    this.chain( () => new Promise( resolve => {
      if (this.stopAnimation) return resolve();
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
    this.chain( () => this.stopAnimation = false );
    return this;
  }
  clearNow() {
    this.stop().clear();
    return this;
  }

}

// ****************************************************





// const buildWaveLoader = (waveElement, colors, spanNum) => {
//   let spans = '';
//   for( let i=0; i<spanNum; i++ ) {
//     // const opacity = 1 - i / spanNum; // descending opacity 
//     const diagonalToContainerRatio = 100 / spanNum * (i+1);
//     const distanceBetweenCircles = i/20;
//     const colorIdx = i % colors.length;
//     const color = colors[colorIdx];
    
//     const spanStyle = `
//       width: ${diagonalToContainerRatio}%;
//       height: ${diagonalToContainerRatio}%;
//       animation-delay: ${distanceBetweenCircles}s;
//       border-color: ${color};
//     `;
//     const span = `<span style='${spanStyle}'></span>`;
//     spans += span;
//   }
//   waveElement.innerHTML = spans;
// }

// const wave = document.querySelector('.loading-wave');
// const colors = [  '#FF6138', '#f2f1c6'/* , '#8e2890' */];
// buildWaveLoader(wave, colors, 20);



// animateScramble({infinite: false, interval: 2000});


// ADD COPY FUNCTIONALITY TO EMAIL LINK
// let emailLink = document.querySelector('#contact-info [href^="mailto"]');
// console.log(emailLink);
// emailLink.insertAdjacentHTML(
//   'afterend', 
//   `<span id="copy-email" class="c-subtle pointer icon-explanation-on-hover">
//     <i class="fas fa-copy"></i>
//   </span>`
// );

// let emailCopier = document.getElementById('copy-email');
// emailCopier.addEventListener('click', e => {

// });

  // const enableTransitions = () => document.querySelector('.preload').classList.remove('preload');

  window.initContact = () => {
    // enableTransitions();
    animateScramble({infinite: false, interval: 2000});


    const art = document.getElementById('contact-art');
    const imgContainer = art.querySelector('#img');

    const colorSvg = (svgEl, colors) => {
      let style = svgEl.getAttribute('style') || '';
      colors.forEach( (color,i) => {
        style += ` --color-${i}: ${color}; `;
      });
      svgEl.setAttribute('style', style );

      svgEl.querySelectorAll('path').forEach( (path, i) => {
        path.setAttribute('fill', `var(--color-${i})`);
      })
    }

    let a = () => {
      // lazy.loadImg('imgs/quotes/gandhi.svg').then( img => {
      //   img.style.width = '100%';
      //   art.innerHTML = '';
      //   art.append(img);
      // })

      fetch('imgs/quotes/gandhi1.svg')
      // fetch('imgs/quotes/lee1.svg')
      // fetch('imgs/quotes/lee2.svg')
      // fetch('imgs/quotes/lee3.svg')
      // fetch('imgs/quotes/chan4.svg') // colors = [ 'var(--color-bright)', 'var(--color-subtle)']
      // fetch('imgs/quotes/feynman.svg') // colors = ['var(--color-bright)', '#afadad','var(--color-subtle)']
      // fetch('imgs/rv-vector.svg')
        .then( res => res.text() )
        .then( svg => {
          // wave.classList.add('hide');
          // art.insertAdjacentHTML( 'afterbegin', svg );
          imgContainer.innerHTML = svg;
          let svgEl = imgContainer.querySelector('svg');
          // svgEl.style.width = '100%';
          // svgEl.style.height = 'auto';

          let colors = ['var(--color-subtle)', '#afadad', 'var(--color-bright)', 'var(--color-orange)'];

          // colors = [
          //   'var(--color-bright)', 
          //   'var(--color-subtle)', 
          //   'var(--color-orange)',
          // ]
          colors = [/* 'var(--color-subtle)' */ 'black', 'var(--color-bright)', '#afadad']
          // sort pathes by the areas covered
          // const descendingPathes = [...art.querySelectorAll('path')].sort((a,b) => {
          //   return a.getAttribute('d').length - b.getAttribute('d').length;
          // })
          
          // descendingPathes
          // art.querySelectorAll('path').forEach( (path, i) => {
          //   let color = colors[ i % colors.length];
          //   path.setAttribute('fill', color);
          // })
          colorSvg( svgEl, colors );
          
        } )


    };

    const artMap = [
      {
        imgUrl: 'imgs/quotes/gandhi1.svg', 
        imgUrl: 'imgs/quotes/lee3.svg',
        colors: [/* 'var(--color-subtle)' */ 'black', 'var(--color-bright)', '#afadad'], 
        quote: ["A man is but the product of his thoughts. What he thinks, he becomes.", "- Mahatma Gandhi"]
      },
      {
        imgUrl: 'imgs/quotes/feynman.svg',
        // colors: ['var(--color-subtle)', '#afadad', 'var(--color-bright)', 'var(--color-orange)'],
        colors: ['var(--color-bright)', '#afadad', 'black'/* 'var(--color-subtle)' */],
        quote: ["I'm smart enough to know that I'm dumb.", "- Richard Feynman"]
      }
    ]


    const $quote = document.getElementById('quote');
    const $quotation = $quote.querySelector('.quotation > span');
    const $author = $quote.querySelector('.author');
    const speed = [20, 100];
    const typer1 = new TextTyper($quotation, ...speed);
    const typer2 = new TextTyper($author, ...speed);
    const typeQuote = ([quotation, author]) => {
      $quote.querySelectorAll('.text-cursor').forEach( x => x.classList.remove('text-cursor'));

      typer1
        .clearNow()
        .chain( () => typer1.container.classList.add('text-cursor'))
        .type(quotation)
        .chain( () => typer1.container.classList.remove('text-cursor'))
        .chain( () => {
          typer2
            .chain( () => typer2.container.classList.add('text-cursor'))
            .type(author)
            // .chain( () => typer2.container.classList.add('text-cursor'))
        })
    };


    const loadImg = async (url, colors) => {
      const svg = await fetch(url).then( res => res.text() );
      imgContainer.innerHTML = svg;
      let svgEl = imgContainer.querySelector('svg');
      colorSvg( svgEl, colors );
    }

    const loadArt = (count) => {
      const {imgUrl, colors, quote} = artMap[count];
      loadImg( imgUrl, colors );
      typeQuote( quote );
    }

    loadArt(1);




  }

})();