const helpers = (function() {
'use strict';

  let publicAPIs = {};
  let xvalue;

  publicAPIs.geoLoc = async function(name, value, actionStore) {
    await navigator.geolocation.getCurrentPosition( async (position) => {
      // console.log(position);
      // if (name === 'send_user_geolocation') {
      //   if (position) {
      //     actionStore = await window.simpleUpdateIn(
      //       actionStore,
      //       ['payload', 'activity', 'channelData', 'location' ],
      //       () => position
      //       );
      //     console.log( name, value, actionStore)
      //   }
      // }
      
      if (name === 'display_user_geolocation') {
        store.dispatch( {
          type: 'WEB_CHAT/SEND_EVENT',
          payload: {
            name: `${ name }`,
            value: {
              name: `${ value }`,
              location: { latitude: latitude, longitude: longitude }
            }
          }
        } );
      }
      return actionStore;
    }, () =>
    {
      console.log('fail')
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
