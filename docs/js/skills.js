// "use strict";

(function() {
  const skillsCloudOptions = {
    // shape: "sphere",
  
    // dragControl: true,
  
    // textColour: '#fe0853', //pink
    // textColour: '#08FDD8', //blue
    // textColour: '#00000', //black
    // textColour: '#ffffc2', // yellow 
    // textColour: '#FF6138', 
    textColour: lazy.getCssVariable('--color-highlight'), 
    
    // outlineThickness: 0.5,
    // outlineColour: '#fe0853',
  
    maxSpeed: 0.04,
    freezeActive: true,
    shuffleTags: true,
    shape: 'sphere',
    zoom: 0.9,
    noSelect: true,
  
    textFont: null, 
    
    pinchZoom: true,
    freezeDecel: true,
    fadeIn: 1500,
    initial: [0.3, -0.1],
    depth: 0.8, //0.8
  
    weight: true,
    // weightFrom: 'data-weight',
    // weightSize: 2,
    wheelZoom: false,
  };


  const initSkillsCloud = () => {
    // should be called after tagcanvas.min.js is loaded
    skillsCloudOptions.textFont = 'Courier';
    TagCanvas.Start('skills-canvas', 'skills-cloud', skillsCloudOptions );
    document.getElementById('skills-container').classList.remove('hide');
  }

  const bindContactLink = () => {
    document
      .getElementById('contact-me2')
      .addEventListener('click', lazy.navigateToPageFromLink );
  }

  const scramble = new TextScramble('.h1-tags');

  lazy.onDocumentReady( () => {
    bindContactLink();
  });

  window.initSkills = () => {
    initSkillsCloud();
    scramble.animate();
  }
})();
