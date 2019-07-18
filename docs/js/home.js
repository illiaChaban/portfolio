(function() {
  // ***********
  // rendering rv and squirrel
  const $art = document.getElementById('art');
  const $rvContainer = document.getElementById('rv-squirrel-container');
  const $content = document.getElementById('content');

  const updateArtWidth = () => {
    // set content width in pixels instead of percentage
    $art.setAttribute( 'style', `--content-width: ${$content.offsetWidth}px;`);
  };
  updateArtWidth();
  window.addEventListener('resize', updateArtWidth);
  // show squirrel and rv after css variable was updated to indicate
  // content width in pixels
  $rvContainer.classList.remove('hide'); 
  // *******

  

  let hiAnimation = null;
  let dashWasAnimated = false;
  // should be called after anime.js was loaded
  window.initHomeHiAnimation = () => {
  
    // HI
    if (!hiAnimation) {
      document.querySelector(".ml8").classList.remove('hide');
      hiAnimation = anime.timeline({loop: false}).add({
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
    }

    hiAnimation.restart();
    

    // should be called only once
    if (!dashWasAnimated) {
      anime({
        targets: '.ml8 .circle-dark-dashed',
        rotateZ: 360,
        duration: 8000,
        easing: "linear",
        loop: true
      });
      dashWasAnimated = true;
    }
  }   

})();
      