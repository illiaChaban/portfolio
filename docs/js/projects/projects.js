
let initialized = false;

window.initProjects = () => {
  if (initialized) return;
  // Refs
  const project = document.querySelector('.project');
        wrapCta  = project.querySelector('#wrap-cta'),
        btnCta   = project.querySelector('#cta'),
        content  = project.querySelector('.content'),
        btnClose = project.querySelector('#close');
  
  
  // Anime.js Commons Values for SVG Morph
  const common = {
    targets: '.polymorph',
    easing: 'easeOutQuad',
    duration: 600,
    loop: false
  };
  
  
  // Show content
  btnCta.addEventListener('click', () => {
    // Elements apparence
    wrapCta.classList.remove('active');
    content.classList.add('active');
    
    // Morph SVG
    anime({
      ...common,
      points: [
        { value: '100,100 0,100 99,99 100,0' }
      ],
    });
  });
  
  
  // Hide content  
  btnClose.addEventListener('click', () => {
    // Elements apparence
    content.classList.remove('active');
    wrapCta.classList.add('active');
    
    // Morph SVG
    anime({
      ...common,
      points: [
        { value: '100,100 0,100 0,0 100,0' }
      ]
    }); 
  });

  initialized = true;
}
