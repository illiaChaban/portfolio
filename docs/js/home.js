(function() {

  const wrapEveryLetterInSpan = (selector) => {
    let elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      el.innerHTML = el.textContent.replace(/(\w|,|')/g, "<span class='letter'>$&</span>");
    })
  };


  let animations = [];
  const prepareAnimations = () => {

    wrapEveryLetterInSpan('.ml3');
    document.querySelectorAll('.ml3 .letter').forEach( l => {
      l.style.opacity = 0;
    });
    let headerFadeIn = anime.timeline({loop: false})
      .add({
        targets: '.ml3 .letter',
        opacity: [0,1],
        easing: "easeInOutQuad",
        duration: 250,
        delay: function(el, i) {
          return 50 * (i+1)
        }
      });

  
    // HI
    // document.querySelector(".ml8").classList.remove('hide');
    let hiAnimation = anime.timeline({loop: false}).add({
      targets: '.ml8 .circle-white',
      scale: [0, 3],
      opacity: [1, 0],
      easing: "easeInOutExpo",
      rotateZ: 360,
      duration: 1100
    })
    .add({
      targets: '.ml8 .circle-container',
      scale: [0, 1],
      duration: 1100,
      easing: "easeInOutExpo",
      offset: '-=1000'
    })
    .add({
      targets: '.ml8 .circle-dark',
      scale: [0, 1],
      duration: 1100,
      easing: "easeOutExpo",
      offset: '-=600'
    })
    .add({
      targets: '.ml8 .letters-left',
      scale: [0, 1],
      translateY: ['38%', '38%'], //centering letters
      duration: 1200,
      offset: '-=550'
    })
    .add({
      targets: '.ml8 .bang',
      scale: [0, 1],
      translateY: ['38%', '38%'], //centering letters
      opacity: [0,1],
      rotateZ: [45, 15],
      duration: 1200,
      offset: '-=1000'
    })
    .add({}); // fixes "!" bug

    animations.push( headerFadeIn );
    animations.push( hiAnimation );
  };


  const prepareArt = () => {
    // rendering rv and squirrel
    const $art = document.getElementById('art');
    const $rvContainer = document.getElementById('rv-squirrel-container');
    const $content = document.getElementById('content');
  
  
    const updateArtWidth = () => {
      // in case content was hidden to rerender css animations etc. use body as a fallback
      let contentWidth = $content.offsetWidth || document.body.offsetWidth;
      // set content width in pixels instead of percentage
      $art.style.setProperty( '--content-width', `${contentWidth}px`);
    };
    updateArtWidth();
    window.addEventListener('resize', updateArtWidth);
    // show squirrel and rv after css variable was updated to indicate
    // content width in pixels
    $rvContainer.classList.remove('hide'); 
  }

  const bindContactLink = () => {
    document
      .getElementById('contact-me')
      .addEventListener('click', lazy.navigateToPageFromLink ); 
  }

 
  
  window.init.home = () => {
    lazy.callOnce(
      bindContactLink,
      prepareArt
    );

    // should be called after anime.js was loaded
    if (!animations.length) { 
      prepareAnimations();
    } else {
      animations.forEach( a => a.restart() );
    }
  }   



})();
      