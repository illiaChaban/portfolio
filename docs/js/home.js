(function() {
  
  const $art = document.getElementById('art');
  const $rvContainer = document.getElementById('rv-squirrel-container');
  const $content = document.getElementById('content');

  const updateArtWidth = () => {
    $art.setAttribute( 'style', `--content-width: ${$content.offsetWidth}px;`);
  };

  window.initHome = () => {
  
    updateArtWidth();
    $rvContainer.classList.remove('hide');
    window.addEventListener('resize', updateArtWidth);
  
    // HI
    document.querySelector(".ml8").classList.remove('hide');
    anime.timeline({loop: false})
      .add({
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
    
    anime({
      targets: '.ml8 .circle-dark-dashed',
      rotateZ: 360,
      duration: 8000,
      easing: "linear",
      loop: true
    });
  }   

})();
      