const colorOrange = '#ff6138';
const colorBright = '#f2f1c6';
const colorSubtle = '#808080';

const grab2 = {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 1026
      }
    },
    "color": {
      "value": colorOrange
    },
    "shape": {
      "type": "circle",
    },
    "opacity": {
      "value": 0.3,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 1.5, //circle size
      "random": false,
      "anim": {
        "enable": false,
        "speed": 20,
        "size_min": 0.1,
        "sync": true
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 120,
      "color": colorOrange, // subtle / orange
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 0.5, // .4 - .8
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "bounce",
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": false,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 150,
        "line_linked": {
          "opacity": .7
        }
      },
    }
  },
  "retina_detect": true,
};



const grab = {
  "particles": {
    "number": {
      "value": 80,
      "density": {
        "enable": true,
        "value_area": 1026
      }
    },
    "color": {
      "value": colorOrange
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0, // shape border
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.3,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 2, //circle size
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 120,
      "color": colorOrange, // subtle / orange
      "opacity": 0.25,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 3,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "bounce",
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": false,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 150,
        "line_linked": {
          "opacity": 0.6
        }
      },
    }
  },
  "retina_detect": true,
};



const starsHover = {
  "particles": {
    "number": {
      "value": 500,
      "density": {
        "enable": true,
        "value_area": 1000
      }
    },
    "color": {
      "value": colorOrange
    },
    "shape": {
      "type": "circle",
      "stroke": {
        "width": 0,
        "color": "#000000"
      },
      "polygon": {
        "nb_sides": 5
      },
      "image": {
        "src": "img/github.svg",
        "width": 100,
        "height": 100
      }
    },
    "opacity": {
      "value": 0.48,
      "random": false,
      "anim": {
        "enable": true,
        "speed": 0.2,
        "opacity_min": 0,
        "sync": false
      }
    },
    "size": {
      "value": 0,
      "random": true,
      "anim": {
        "enable": true,
        "speed": 2,
        "size_min": 0,
        "sync": false
      }
    },
    "line_linked": {
      "enable": false,
      "distance": 150,
      "color": "#ffffff",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 3,
      "direction": "none",
      "random": true,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "bubble"
      },
      "onclick": {
        "enable": true,
        "mode": "push"
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      },
      "bubble": {
        "distance": 90,
        "size": 4,
        "duration": 3,
        "opacity": 1,
        "speed": 3
      },
      "repulse": {
        "distance": 200,
        "duration": 0.4
      },
      "push": {
        "particles_nb": 4
      },
      "remove": {
        "particles_nb": 2
      }
    }
  },
  "retina_detect": true
}


const switcher = {grab, grab2, starsHover};


const getCanvas = () => document.querySelector('#particles canvas');
const createBtns = () => {
  let btns = '';
  for( let config in switcher ) {
    btns += `<button id=${config}>${config}</button>`
  }
  document.getElementById('particles-buttons').innerHTML = btns;
  return document.querySelectorAll("#particles-buttons button");
}
const activateConfig = (id) => {
  config = switcher[id];
  particlesJS('particles', config);

  // show active config by color
  let prevActive = document.querySelector("#particles-buttons .active");
  prevActive && prevActive.classList.remove('active');
  document.getElementById(id).classList.add('active');
}



createBtns().forEach( btn => btn.addEventListener('click', () => activateConfig(btn.id) ));

activateConfig("grab")

console.log('particles initialized');






