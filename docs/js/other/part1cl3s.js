(function() {
  const colorOrange = '#ff6138';
  const colorBright = '#f2f1c6';
  const colorSubtle = '#808080';
  
  const orange = {
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
        "opacity": 0.4, // .4
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
          "distance": 130,
          "line_linked": {
            "opacity": 0.8 //.7
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

  const subtle = {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 1026
        }
      },
      "color": {
        "value": colorSubtle
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
        "color": colorSubtle, // subtle / orange
        "opacity": 0.5, // .4
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
          "distance": 130,
          "line_linked": {
            "opacity": 1 //.7
          }
        },
      }
    },
    "retina_detect": true,
  };
  
  
  const none = true;
  
  
  const switcher = { orange, subtle, none};
  
  
  const getCanvas = () => document.querySelector('#particles canvas');
  // const hideCanvas = () => getCanvas().style.visibility = 'hidden';
  // const showCanvas = () => getCanvas().style.visibility = 'visible';
  const removeCanvas = () => {
    let canvas = getCanvas()
    canvas && canvas.parentNode.removeChild( canvas );
  };
  const createBtns = () => {
    let btns = '';
    for( let config in switcher ) {
      btns += `<button id=${config}>${config}</button>`
    }
    document.getElementById('particles-buttons').innerHTML = btns;
    return document.querySelectorAll("#particles-buttons button");
  }
  const activateConfig = (id) => {
    if (id === 'none') {
      // document.getElementById('particles').innerHTML = '';
      removeCanvas();
    } else {
      config = switcher[id];
      particlesJS('particles', config);
      // showCanvas();
    }
  
    // show active config by color
    let prevActive = document.querySelector("#particles-buttons .active");
    let curr = document.getElementById(id);
    prevActive && prevActive.classList.remove('active');
    curr && curr.classList.add('active');
  }
  
  
  
  createBtns().forEach( btn => btn.addEventListener('click', () => activateConfig(btn.id) ));
  
  activateConfig("none")
  
  console.log('particles initialized');

})();






