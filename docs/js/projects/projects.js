
let initialized = false;

window.initProjects = () => {
  if (initialized) return;
  // Refs
  const project = document.querySelector('.project'),
        containerClosed = project.querySelector('.container-closed'),
        containerOpen = project.querySelector('.container-open');
        // btnOpen   = project.querySelector('button.open'),
        // btnClose = project.querySelector('button.close');
  
  
  // Anime.js Commons Values for SVG Morph
  const common = {
    targets: '.polymorph',
    easing: 'easeOutQuad',
    duration: 600,
    loop: false
  };





  let initialPoints = project.querySelector('.polymorph').getAttribute('points');
  console.log(initialPoints)


  // console.log(openSvg)
  // console.log(openSvg.pause());

  let openSvg, closeSvg; //saving animations to be able to stop them

  const showContent = () => {
    // Elements apparence
    project.classList.add('active');

    if (closeSvg) closeSvg.pause();

    // Morph SVG
    openSvg = anime({
      ...common,
      points: [
        // { value: '100,100 0,100 98,98 100,0' }
        // { value: '98,98 0,100 100,100 100,0' }
        // { value: '98,98 0,100 100,100 100,0' }
        { value: '0,0 0,100 100,100 100,0' }
      ],
    });

    // openSvg.restart();
  };

  const hideContent = () => {
    // Elements apparence
    project.classList.remove('active');
    
    if (openSvg) openSvg.pause();

    // Morph SVG
    closeSvg = anime({
      ...common,
      points: [
        // { value: '100,100 0,100 0,0 100,0' }
        // { value: '0,0 0,100 100,100 100,0' }
        { value: initialPoints }
      ]
    }); 

  }
  
  
  // Show content
  containerClosed.addEventListener('click', showContent);
  containerOpen.addEventListener('click', hideContent);

  // project.addEventListener('mouseenter', showContent);
  // project.addEventListener('mouseleave', hideContent);
  
  
  // Hide content  

  initialized = true;
}
