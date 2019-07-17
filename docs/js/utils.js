window.utils = {
  onDocumentReady( callback ) {
    // console.log("ON DOCUMENT READY CALLED", document.readyState, {cb: callback.toString()})
    document.readyState === 'loading' ? 
      window.addEventListener('DOMContentLoaded', callback ) :
      callback();
  },
  	// vanilla JS window width and height
	getWindowWidthHeight() {
		var w=window,
		d=document,
		e=d.documentElement,
		g=d.getElementsByTagName('body')[0],
		x=w.innerWidth||e.clientWidth||g.clientWidth,
		y=w.innerHeight||e.clientHeight||g.clientHeight;
		return [x,y];
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