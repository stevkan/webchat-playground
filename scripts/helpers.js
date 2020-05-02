const helpers = (function() {
'use strict';

  let publicAPIs = {};
  let xvalue;

  publicAPIs.geoLoc = async function(name, value, store) {
    await navigator.geolocation.getCurrentPosition( async (position) => {
      if (name === 'get_geolocation') {
        if (position) {
          sessionStorage.setItem('latitude', position.coords.latitude);
          sessionStorage.setItem('longitude', position.coords.longitude);
        }
      }
      
      if (name === 'send_user_geolocation') {
        store.dispatch( {
          type: 'WEB_CHAT/SEND_EVENT',
          payload: {
            name: `${ name }`,
            value: {
              name: `${ value }`,
              location: { latitude: position.coords.latitude, longitude: position.coords.longitude }
            }
          }
        } );
      }
    }, (error) =>
    {
      console.log('WEB_CHAT >> GEOLOCATION_GET_POSITION_FAILURE: ', error);
    } );
  }  

  publicAPIs.generateUserName = async function(userName) {
    const usernames = [ 'Seafood Treasure', 'Rahvin', 'Seamus', 'Shamus', 'Gurthang', 'Lord Voldemort', 'Captain LoudMouth', 'Picklehead', 'Popeye', 'He Who Shall Be Named Only On Tuesdays' ];
    userName = await usernames[ Math.floor( Math.random() * usernames.length ) ];
    return userName;
  }

  publicAPIs.webChatVersion = async function () {
    // Returns an displays Web Chat version
    const webChatVersion = [].map.call( document.head.querySelectorAll( 'meta[name^="botframework-"]' ), function ( meta ) { return meta.outerHTML; } )
    console.groupCollapsed('Web Chat Version')
    for (let v in webChatVersion) {
      console.info(webChatVersion[v]);
    }
    console.groupEnd()
  }

  publicAPIs.startTimer = async function(countdown, setCountdown, handleDismissNotification) {
    const timer = setInterval( async () => {
      if ( countdown >= 1 ) {
        console.log('Countdown ', countdown)
        await setCountdown( --countdown );
      }
    }, 1000 );
    if ( countdown === 0 ) {
      handleDismissNotification();
    }
  };

  return publicAPIs;
})();
