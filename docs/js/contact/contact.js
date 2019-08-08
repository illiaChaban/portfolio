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

const buildWaveLoader = (waveElement, colors, spanNum) => {
  let spans = '';
  for( let i=0; i<spanNum; i++ ) {
    // const opacity = 1 - i / spanNum; // descending opacity 
    const diagonalToContainerRatio = 100 / spanNum * (i+1);
    const distanceBetweenCircles = i/10;
    const colorIdx = i % colors.length;
    const color = colors[colorIdx];
    
    const spanStyle = `
      width: ${diagonalToContainerRatio}%;
      height: ${diagonalToContainerRatio}%;
      animation-delay: ${distanceBetweenCircles}s;
      border-color: ${color};
    `;
    const span = `<span style='${spanStyle}'></span>`;
    spans += span;
  }
  waveElement.innerHTML = spans;
}

lazy.onDocumentReady( () => {
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
  
  
  
  
  const wave = document.querySelector('.loading-wave');
  const colors = [  '#FF6138', '#f2f1c6'/* , '#8e2890' */];
  buildWaveLoader(wave, colors, 15);
  
  
    // const enableTransitions = () => document.querySelector('.preload').classList.remove('preload');
  
  window.initContact = () => {
    // enableTransitions();
    animateScramble({infinite: false, interval: 2000});
  }
})

})();