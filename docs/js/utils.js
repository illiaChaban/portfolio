window.utils = {
  onDocumentReady( callback ) {
    // console.log("ON DOCUMENT READY CALLED", document.readyState, {cb: callback.toString()})
    document.readyState === 'loading' ? 
      window.addEventListener('DOMContentLoaded', callback ) :
      callback();
  },

  // fonts loader
  // fontsWereRequested: false,
  // loadFonts(requestBy='') {
  //   if (utils.fontsWereRequested === false) {
  //     utils.fontsWereRequested = new Promise( async (resolve, reject) => {
  //       await utils.loadScript("https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js");
  //       WebFont.load({
  //         google: {
  //           families: [ 'Permanent Marker', 'Orbitron', /* 'Special Elite', */ 'Sacramento' ]
  //         },
  //         active() {
  //           resolve();
  //           console.log('Fonts loaded, request by ' + requestBy)
  //         },
  //         inactive: resolve,
  //         fontinactive(familyName) { console.warn( "Failed to load font " + familyName); }
  //       });
  //     }).catch( console.error )
  //   }
  //   return utils.fontsWereRequested;
  // },



  // loadJs( sources, callbackName ) {
  //   let loadedScripts = sources.map( src => utils.loadScript(src));
  //   Promise.all(loadedScripts)
  //     .then( () => callbackName && window[callbackName]() )
  //     .catch( (e) => console.error(e) );
  // }

  
}