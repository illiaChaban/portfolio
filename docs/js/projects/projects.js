(function(){
  let initialized = false;
  
  // Anime.js Commons Values for SVG Morph
  const common = {
    targets: '.polymorph',
    easing: 'easeOutQuad',
    duration: 600,
    loop: false
  };
  
  window.initProjects = () => {
    // call after animeJS was loaded
    if (initialized) return;
  
    // should be equal for all projects
    const openingSvgPoints = document.querySelector('.project .polymorph').getAttribute('points');

    document.querySelectorAll('.project').forEach( project => {
      
        const btnToggle = project.querySelector('.toggle');
      
      
        let openSvg, closeSvg; //saving animations to be able to stop them
      
        const showContent = () => {
          // Elements apparence
          project.classList.add('active');
      
          // stop closing animation if active
          if (closeSvg) closeSvg.pause();
      
          // Morph SVG
          openSvg = anime({
            ...common,
            points: [
              { value: '0,0 0,100 100,100 100,0' }
            ],
          });
        };
      
        const hideContent = () => {
          // Elements apparence
          project.classList.remove('active');
          
          // stop opening animation if active
          if (openSvg) openSvg.pause();
      
          // Morph SVG
          closeSvg = anime({
            ...common,
            points: [
              { value: openingSvgPoints }
            ]
          }); 
        }
      
        const toggleContent = () => {
          project.classList.contains('active') ?
            hideContent():
            showContent();
        }
        
        
        // containerClosed.addEventListener('click', showContent);
        // containerOpen.addEventListener('click', hideContent);
      
        btnToggle.addEventListener('click', toggleContent);
      
        // project.addEventListener('mouseenter', showContent);
        // project.addEventListener('mouseleave', hideContent);
    });
    
  
    initialized = true;
  }
})();

