const getMiddleware = ( function () {
  'use strict';

  let publicAPIs = {};
  let timers = [];

  publicAPIs.storeMiddleware = async function (
    store,
    next,
    action,
    userName,
    mapMaker,
    helpers,
    window
  ) {
    publicAPIs.store = store;
    publicAPIs.helpers = helpers;
    const document = window.document;
    let location;

    if (action.type === 'DIRECT_LINE/UPDATE_CONNECTION_STATUS') {
      if (action.payload) {
        let connectionType;
        switch (action.payload.connectionStatus) {
          case 0:
            connectionType = 'UNINITIATED';
            break;
          case 1:
            connectionType = 'CONNECTING';
            break;
          case 2:
            connectionType = 'ONLINE';
            break;
          case 3:
            connectionType = 'TOKEN_EXPIRED';
            break;
          case 4:
            connectionType = 'FAILED_TO_CONNECT';
            break;
          case 5:
            connectionType = 'ENDED';
            break;
          default:
            connectionType = 'ERROR_GETTING_CONNECTION_STATUS'
        }
        console.log(`DIRECT_LINE >> UPDATED_CONNECTION_STATUS: ${ connectionType }`);
      }
    }
    
    if ( action.type === 'DIRECT_LINE/POST_ACTIVITY' ) {
      document.querySelector( 'ul[role="list"]' ).scrollIntoView( { behavior: 'smooth', block: 'end' } );
    }

    if (action.type === 'DIRECT_LINE/RECONNECT') {
      console.log('WEB_CHAT >> RECONNECTING')
      setTimeout(() => {
        store.dispatch( {
          type: 'WEB_CHAT/SEND_MESSAGE_BACK',
          payload: {
            value: 'isLoggedOn',
            displayText: `${userName} rejoined the conversation`,
            text: `${userName} rejoined the conversation`
          }
        } );
      }, 1000);

      // await startWebChat();
      // setTimeout(() => {
      //   store.dispatch( {
      //     type: 'DIRECT_LINE/UPDATE_CONNECTION_STATUS',
      //     payload: 'ONLINE'
      //   } )
      // }, 1000);
    }

    if (action.type === 'DIRECT_LINE/CONNECT') {
      console.log('WEB_CHAT >> CONNECTED')
      // store.dispatch({
      //   type: 'DIRECT_LINE/UPDATE_CONNECTION_STATUS',
      //   payload: {
      //     connectionStatus: 'ONLINE'
      //   }
      // })
      // setTimeout( () => {
      //   console.log( 'timer set' )
      //   store.dispatch( {
      //     type: 'WEB_CHAT/SET_NOTIFICATION',
      //     payload: {
      //       data: { accepted: false },
      //       id: 'isLoggedOn',
      //       level: 'info'
      //     }
      //   } );
      // }, activeCountdown );
    }

    if (action.type === 'DIRECT_LINE/DISCONNECT_FULFILLED') {
      console.log('WEB_CHAT >> DISCONNECTED')
      if ( action.payload && action.payload.activity && action.payload.activity.channelData ) {
        const { channelData } = action.payload.activity;
        if ( channelData.action === 'logoff_received' ) {
          // store.dispatch( {
            //   type: 'DIRECT_LINE/DISCONNECT'
            // } )
            // return next(action);
          }
        }
        // store.dispatch({
        //   type: 'DIRECT_LINE/UPDATE_CONNECTION_STATUS',
        //   payload: {
        //     connectionStatus: 5
        //   }
        // })
    }

    if (action.type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      if (action.payload && action.payload.activity) {
        const { activity, activity: { attachments, channelData, from: { role }, name } } = action.payload;
        switch (role) {
          case "bot":
            console.log('INCOMING_ACTIVITY ', activity);
            break;
          case "user":
            console.log('OUTGOING_ACTIVITY ', activity);
            break;
        }

        caches.open('web-chat')
          .then(function(cache) {
            return cache.add('./playground-wc.html');
          })
        
        if (channelData && channelData.action) {
          if(channelData.action === 'dialog_reset') {
            store.dispatch( {
              type: 'WEB_CHAT/SEND_MESSAGE',
              payload: {
                text: 'Diaalloggg...START!'
              }
            } )
          }

          if(channelData.action === 'getGeolocation') {
            console.log('WEB CHAT => LOGGING_GEOLOCATION')
            const location = new Promise((resolve, reject) => {
              let result = mapMaker(store)
              if (result) {
                resolve()
              } else {
                reject()
              }
            });

            location
              .then(() => {
                const myMap = document.getElementById('myMap');
                myMap.setAttribute('style', 'height: 60vh; width: 60vw;');
                const sendMessageEvent = new Event( 'sendMessageEvent' );
                sendMessageEvent.data = { type: 'event', name: 'send_user_geolocation', value: 'user_geolocation' }
                window.dispatchEvent( sendMessageEvent )
              })
              .catch((error) => {
                console.log(`WEB CHAT => GEOLOCATION_LOGGING_FAILED (${ error })`)
              })
          }
        }

        publicAPIs.clearTimers = () => {
          for (let t of timers) {
            clearInterval(t);
            timers.pop(t);
          }
        }

        function refreshTimer() {
          publicAPIs.clearTimers();
          let timer = setInterval( async () => {
            await startDirectLine();
          }, 1500000);
          timers.push(timer);
        }

        if (activity.type === 'event' || activity.type === 'message') {
          if (activity.from.role === 'user') {
            if (activity.name === 'webchat/join' || activity.text) {
              refreshTimer();
            }
          }
        }
  
        if (activity.type === 'message') {
          // Get activity watermark
          const index = activity.id.indexOf('|');
          const watermarkString = activity.id.substr(index + 1);
          let watermark = Number(watermarkString);
  
          if (watermark === 0) {
            store.dispatch({
              type: 'WEB_CHAT/SEND_MESSAGE_BACK',
              payload: {
                text: '',
                value: { token: sessionStorage.getItem( 'token' ) }
              }
            })
            store.dispatch({
              type: 'WEB_CHAT/SEND_EVENT',
              payload: {
                name: 'webchat/join',
                value: { language: window.navigator.language }
              }
            })
          }
  
          switch (watermark > 9) {
            case true:
              let newWatermark = watermark - 10;
              if (newWatermark > sessionStorage.getItem( 'watermark' )) {
                sessionStorage.setItem( 'watermark', newWatermark );
              }
              break;
            default:
              sessionStorage.setItem( 'watermark', 0 );
          }

          // Update card button text
          let cardButtons = document.body.getElementsByClassName( 'ac-pushButton' )
          for ( let i = 0; i <= cardButtons.length - 1; i++ ) {
            if ( cardButtons[ i ].children[ 0 ].nodeName === 'DIV' && cardButtons[ i ].children[ 0 ].innerHTML === 'Placeholder Message' ) {
              // cardButtons[ i ].children[ 0 ].setAttribute( 'style', 'font-weight: normal; color: black' )
              cardButtons[ i ].children[ 0 ].innerHTML = '<p><b>Service details</b></p>'
              // cardButtons[i].children[0].innerHTML = '<p><b>Service details</b><br />\"Service details for PC request\"</p> '
              continue;
            }
          }

          if ( attachments && attachments[ 0 ] && attachments[ 0 ].content && attachments[ 0 ].content.trigger && attachments[ 0 ].content.trigger === 'cardTrigger' ) {
            setTimeout( () => {
              let children = document.getElementsByClassName( 'ac-adaptiveCard' );
              for ( let i = 0, j = children.length; i <= j - 1; i++ ) {
                if ( i === j - 1 ) {
                  let child = children[ i ];
                  if ( child.lastChild.innerHTML.includes( 'Service details' ) ) {
                    child.id = 'card_1'
                  }
                }
              }
            }, 300 )
          }

          if (activity.text) {
            if (activity.text.toLowerCase() === 'map in') {
              try {
                console.log('WEB_CHAT => LOGGING_GEOLOCATION')
                // store.dispatch({
                //   type: 'WEB_CHAT/SEND_MESSAGE_BACK',
                //   payload: {
                //     displayText: 'Test 1',
                //     text: 'Test 2',
                //     value: 'Test 3'
                //   }
                // })
                const type = 'event',
                  name = 'send_user_geolocation',
                  value = 'user_geolocation';
                const result = await publicAPIs.helpers.geoLoc(name, value, publicAPIs.store);
                console.log(result)
                  // const sendMessageEvent = new Event( 'sendMessageEvent' );
                // sendMessageEvent.data = { type: type, name: name, value: value }
                // window.dispatchEvent( sendMessageEvent )
              } catch(error) {
                console.log(`WEB CHAT => GEOLOCATION LOGGING FAILED (${ error })`)
              }
            }

            if (activity.text.toLowerCase() === 'map out') {
              try {
                console.log('WEB_CHAT => LOGGING_GEOLOCATION')
                const type = 'event',
                  name = 'display_user_geolocation',
                  value = 'display_geolocation';
                const sendMessageEvent = new Event( 'sendMessageEvent' );
                sendMessageEvent.data = { type: type, name: name, value: value }
                window.dispatchEvent( sendMessageEvent )
              } catch(error) {
                console.log(`WEB_CHAT => GEOLOCATION_LOGGING_FAILED (${ error })`)
              }
            }
          }
        }
      }
    }

    if (action.type === 'DIRECT_LINE/POST_ACTIVITY') {
      if (action.payload && action.payload.activity) {
        const { activity, activity: { from } } = action.payload;
        const name = 'send_user_geolocation',
          value = 'user_geolocation';
        if (activity.text && activity.text.toLowerCase() === 'map in') {
          console.log('POST_ACTIVITY ACTION')
          navigator.geolocation.getCurrentPosition(await success, fail);
          
          async function success(position) {
            console.log('POSITION ', position)
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            action = await simpleUpdateIn(
              action,
              ['payload', 'activity', 'channelData', 'location' ],
              () => latitude
            );
            console.log('Action ', action)
            return action
          }
          function fail(error) {
            console.log(`GEOLOCATION_ERROR: ${ error }`)
          }
        }
      }
    }

    return next(action);
  }

  const sendMessageEvent = (function () {
    window.addEventListener( 'sendMessageEvent', async (event) => {
      let { data, data: { type, name, value } } = event;
      if (type === 'message') {
        await publicAPIs.store.dispatch( {
          type: 'WEB_CHAT/SEND_MESSAGE',
          payload: {
            text: `${ value }`
          }
        } );
      }

      if (type === 'event') {
        await publicAPIs.helpers.geoLoc(name, value, publicAPIs.store);
      }
    } );
  })()

  return publicAPIs;

})();
