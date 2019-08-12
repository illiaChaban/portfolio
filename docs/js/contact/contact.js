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

const buildWaveLoader = (selector, colors, spanNum) => {
  const waveElement = document.querySelector(selector);
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

const udpateConfig = (config, defaultConfig) => {
  for( let name in defaultConfig ) {
    if (name in config) continue;
    config[name] = defaultConfig[name];
  } 
  return config;
}

const getScrambleAnimator = (selector, config) => {
  const el = document.querySelector(selector);
  const fx = new TextScramble(el);

  const defaultConfig = {
    phrases:[], 
    infinite: true, 
    interval: 2500,
    currIndex: 0
  }

  config = udpateConfig(config, defaultConfig);
  let {phrases, infinite, interval, currIndex} = config;
  
  const animateScramble = () => {
    if (currIndex < phrases.length) {
      fx.setText(phrases[currIndex]).then(() => {
        currIndex++;
        if (infinite) currIndex %= phrases.length;
        setTimeout( animateScramble, interval)
      })
    } else {
      // reset animator till next call
      currIndex = 0;
    }
  }

  return animateScramble;
}

lazy.onDocumentReady( () => {
  
  const animateScramble = getScrambleAnimator('.scramble-text', {
    phrases: [
      'Hello friend,',
      "Let's build something great!"
    ],
    infinite: false, 
    interval: 2000
  });
  
  
  const colors = [  '#FF6138', '#f2f1c6'/* , '#8e2890' */];
  buildWaveLoader('.loading-wave', colors, 15);
  
  
  window.initContact = () => {
    animateScramble();
  }
})

})();