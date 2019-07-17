// "use strict";

(function() {
  const skillsCloudOptions = {
    // shape: "sphere",
  
    // dragControl: true,
  
    // textColour: '#fe0853', //pink
    // textColour: '#08FDD8', //blue
    // textColour: '#00000', //black
    textColour: '#ffffc2', // yellow
    
    // outlineThickness: 0.5,
    // outlineColour: '#fe0853',
  
    maxSpeed: 0.04,
    freezeActive: true,
    shuffleTags: true,
    shape: 'sphere',
    zoom: 0.9,
    noSelect: true,
  
    // textFont: null, 
    
    pinchZoom: true,
    freezeDecel: true,
    fadeIn: 1500,
    initial: [0.3, -0.1],
    depth: 0.8, //0.8
  
    weight: true,
    // weightFrom: 'data-weight',
    // weightSize: 2,
  };

  window.initSkillsCloud = (textFont=null) => {
    try {
      // update text font
      // is done this way so the font can be async preloaded before initialization
      skillsCloudOptions.textFont = textFont; //'Special Elite' ,'Orbitron'
      TagCanvas.Start('skills-canvas', 'skills-cloud', skillsCloudOptions );
      document.getElementById('skills-container').classList.remove('hide');
    } catch(e) {
      console.error("Skills canvas has error", e);
    }
  }
  
  // window.initSkills = () => utils.loadFont( 'Special Elite' ).finally( () => initSkillsCloud('Special Elite') );
  // utils.onDocumentReady(init);
})();
