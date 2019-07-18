(function() {

  // window.init = window.init || {};
  // window.init.projects = () => {

  window.initFonts = () => {
    iFonts();
    var interval = setInterval( () => {
      try {
        iFonts();
      } catch(e) {
        console.log("STOPPED FONTS")
        clearInterval(interval);
      }
    }, 3000);
  }
  window.iFonts = () => {
    anime.timeline({loop: false})
      .add({
        targets: '.ml5 .letters',
        opacity: 0,
      })
      .add({
        targets: '.ml5 .line',
        opacity: [0.5,1],
        scaleX: [0, 1],
        easing: "easeInOutExpo",
        duration: 700
      }).add({
        targets: '.ml5 .line',
        duration: 600,
        easing: "easeOutExpo",
        translateY: function(e, i, l) {
          var offset = -0.625 + 0.625*2*i;
          return offset + "em";
        }
      }).add({
        targets: '.ml5 .letters-middle',
        opacity: [0,1],
        scaleY: [0.5, 1],
        translateY: ["0.15em", "0.15em"], // centering the font
        easing: "easeOutExpo",
        duration: 600,
        offset: '-=600'
      }).add({
        targets: '.ml5 .letters-left',
        opacity: [0,1],
        translateX: ["0.5em", 0],
        translateY: ["0.15em", "0.15em"], // centering the font
        easing: "easeOutExpo",
        duration: 600,
        offset: '-=300'
      }).add({
        targets: '.ml5 .letters-right',
        opacity: [0,1],
        translateX: ["-0.5em", 0],
        translateY: ["0.15em", "0.15em"], // centering the font
        easing: "easeOutExpo",
        duration: 600,
        offset: '-=600'
      });


    // rising start ---> modal ?
    // Wrap every letter in a span
    function wrapEveryLetterInSpan(selector) {
      let elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // let m = />([a-zA-Z\s]+)</g;
        // let replacor = (match, p1, offset, string) => {
        //   p1 = p1.trim();
        //   console.log({match, p1})
        //   if (p1) {
        //     p1 = p1.replace(/([A-Za-z])/g, "<span class='letter'>$1</span>" )
        //     console.log({p1})
        //     return ">" + p1 + "<";
        //   }
        //   return match;
        // }
        // el.outerHTML = el.outerHTML.replace(m, replacor);
        el.innerHTML = el.textContent.replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>");
      })
    }

    wrapEveryLetterInSpan('.ml13');
    // $('.ml13').each(function(){
    //   $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
    // });
    anime.timeline({loop: false})
      .add({
        targets: '.ml13 .letter',
        translateY: [100,0],
        translateZ: 0,
        opacity: [0,1],
        easing: "easeOutExpo",
        duration: 1400,
        delay: function(el, i) {
          return 300 + 30 * i;
        }
      });


    // hello goodbye
    // Wrap every letter in a span
    // $('.ml11 .letters').each(function(){
    //   $(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
    // });
    wrapEveryLetterInSpan('.ml11 .letters');

    anime.timeline({loop: false})
      .add({
        targets: '.ml11 .letter',
        opacity: null
      })
      .add({
        targets: '.ml11 .line',
        scaleY: [0,1],
        opacity: [0.5,1],
        easing: "easeOutExpo",
        duration: 700
      })
      .add({
        targets: '.ml11 .line',
        // creates line bugs on the first call [css wasn't applied yet?]
        translateX: [0, document.querySelector(".ml11 .letters").offsetWidth], 
        easing: "easeOutExpo",
        duration: 700,
        delay: 100
      }).add({
        targets: '.ml11 .letter',
        opacity: [0,1],
        easing: "easeOutExpo",
        duration: 600,
        offset: '-=775',
        delay: function(el, i) {
          return 34 * (i+1)
        }
      })

    // Wrap every letter in a span
    wrapEveryLetterInSpan(".ml1 .letters")
  
    anime.timeline({loop: false})
      .add({
        targets: '.ml1 .letter',
        scale: [0.3,1],
        translateY: ["0.15em", "0.15em"], // centering the font
        opacity: [0,1],
        translateZ: 0,
        easing: "easeOutExpo",
        duration: 600,
        delay: function(el, i) {
          return 70 * (i+1)
        }
      }).add({
        targets: '.ml1 .line',
        scaleX: [0,1],
        opacity: [0.5,1],
        easing: "easeOutExpo",
        duration: 700,
        offset: '-=875',
        delay: function(el, i, l) {
          return 80 * (l - i);
        }
      });




      // Wrap every letter in a span
    wrapEveryLetterInSpan('.ml3');

    anime.timeline({loop: false})
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
      // anime.timeline({loop: false})
      //   .add({
      //     targets: '.ml8 .circle-white',
      //     scale: [0, 3],
      //     opacity: [1, 0],
      //     easing: "easeInOutExpo",
      //     rotateZ: 360,
      //     duration: 1100
      //   })
      //   .add({
      //     targets: '.ml8 .circle-container',
      //     scale: [0, 1],
      //     duration: 1100,
      //     easing: "easeInOutExpo",
      //     offset: '-=1000'
      //   })
      //   .add({
      //     targets: '.ml8 .circle-dark',
      //     scale: [0, 1],
      //     duration: 1100,
      //     easing: "easeOutExpo",
      //     offset: '-=600'
      //   })
      //   .add({
      //     targets: '.ml8 .letters-left',
      //     scale: [0, 1],
      //     translateY: ['38%', '38%'], //centering letters
      //     duration: 1200,
      //     offset: '-=550'
      //   })
      //   .add({
      //     targets: '.ml8 .bang',
      //     scale: [0, 1],
      //     translateY: ['38%', '38%'], //centering letters
      //     opacity: [0,1],
      //     rotateZ: [45, 15],
      //     duration: 1200,
      //     offset: '-=1000'
      //   })
      //   .add({}); // fixes "!" bug

      // anime({
      //   targets: '.ml8 .circle-dark-dashed',
      //   rotateZ: 360,
      //   duration: 8000,
      //   easing: "linear",
      //   loop: true
      // });
  };



  
})();