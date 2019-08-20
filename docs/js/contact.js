(function(){

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
  };
  

  lazy.onDocumentReady( () => {
    
    const scramble = new TextScramble('.scramble-text', {
      phrases: [
        'Hello friend,',
        "Let's build something great!"
      ],
      interval: 2000
    });
    
    
    const colors = [  'var(--color-highlight)', 'var(--color-main)'/* , '#8e2890' */];
    buildWaveLoader('.loading-wave', colors, 15);
    
    
    window.initContact = () => {
      scramble.animate();
    }
  })

})();