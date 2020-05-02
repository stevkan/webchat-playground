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
        window.dispatchEvent(buttonClickEvent);
      }, 1000);

      // await startWebChat();
      // setTimeout(() => {
      //   store.dispatch( {
      //     type: 'DIRECT_LINE/UPDATE_CONNECTION_STATUS',
      //     payload: 'ONLINE'
      // }, 1000);
    }

    publicAPIs.disconnectMsg = (type) => {
      let webchat = document.getElementById('webchat');
      let noWebchat = document.getElementById('noWebchat');
      if (type === 'DIRECT_LINE/CONNECT') {
        webchat.style.display = 'flex';
        noWebchat.style.display = 'none';
      }
      if (type === 'DIRECT_LINE/DISCONNECT') {
        noWebchat.style = webchat.style;
        noWebchat.innerHTML = webchat.innerHTML;
        const logs = noWebchat.querySelectorAll('[role="log"]');
        logs[1].innerHTML = '<div class="divDisconnected"><div class="disconnected">Web Chat Disconnected</div></div>';
        webchat.style.display = 'none';
        noWebchat.style.display = 'flex';
      }
    }
    
    if (action.type === 'DIRECT_LINE/CONNECT') {
      console.log('WEB_CHAT >> CONNECTED')
      publicAPIs.disconnectMsg(action.type);
  
      //   } )
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

    if (action.type === 'DIRECT_LINE/DISCONNECT') {
      publicAPIs.disconnectMsg(action.type)
      // store.dispatch({
      //   type: 'WEB_CHAT/'
      // })
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
      document.querySelector( 'ul[role="list"]' ).scrollIntoView( { behavior: 'smooth', block: 'end' } );
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
              try {
                console.log('WEB_CHAT => GETTING_GEOLOCATION')
                const name = 'get_geolocation';
                await publicAPIs.helpers.geoLoc(name);
              } catch(error) {
                console.log(`WEB CHAT => GEOLOCATION LOGGING FAILED (${ error })`)
              }
              refreshTimer();
            }
          }
        }

        if (activity.type === 'postBack' && activity.channelData && activity.channelData.updateActivity) {
          // setTimeout(() => {
            const updateActivity = JSON.parse(activity.channelData.updateActivity);
            const idIndex = updateActivity.id.indexOf('|');
            const updateActivityId = updateActivity.id.substr(idIndex + 1)

            document.querySelectorAll('.from-user .webchat__bubble__content').forEach(message => {
              const elementActivityId = message.attributes.activityid.value;
              if (elementActivityId.toString() === updateActivityId.toString()) {
                let p = message.querySelector('p');
                let style = p.getAttribute('style');
                p.innerHTML = updateActivity.text;
                p.setAttribute('style', style);
              }
            });
          // }, 500);
        }
  
        if (activity.type === 'message') {
          if (activity.text || activity.attachments) {
            const userMessages = document.querySelectorAll('.from-user .webchat__bubble__content');
            const userMessageLength = userMessages.length;
            if (userMessageLength > 0) {
              const userMessage = userMessages[ userMessageLength - 1 ];
              const idIndex = activity.id.indexOf('|');
              const activityId = activity.id.substr(idIndex + 1)
              userMessage.setAttribute('activityid', activityId);
            }
          }
          // Get activity watermark
          const index = activity.id.indexOf('|');
          const watermarkString = activity.id.substr(index + 1);
          let watermark = Number(watermarkString);
            
          switch (watermark > 9) {
            case true:
              let newWatermark = watermark - 10;
              if (newWatermark > sessionStorage.getItem( 'watermark' )) {
                sessionStorage.setItem( 'watermark', newWatermark );
              }
              break;
            default:
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
              sessionStorage.setItem( 'watermark', 0 );
          }

          // Update card button text
          const ac_pushButtons = document.querySelectorAll( '.ac-pushButton' )
          for ( let i = 0; i <= ac_pushButtons.length - 1; i++ ) {
            if ( ac_pushButtons[ i ].children[ 0 ].nodeName === 'DIV' && ac_pushButtons[ i ].children[ 0 ].innerHTML === 'Placeholder Message' ) {
              ac_pushButtons[ i ].children[ 0 ].innerHTML = '<div>Service Details</div>'
              // ac_pushButtons[i].children[0].innerHTML = '<div><div>Service details</div><br />\"Service details for PC request\"</div> '
              continue;
            }
          }
          
          if (attachments && attachments[ 0 ]) {
            setTimeout(() => {
              const ac_cards = document.querySelectorAll( '.ac-adaptiveCard' )
              let ac_buttons = [];
              ac_cards.forEach(card => {
                let pushButtons = card.querySelectorAll( '.ac-pushButton' );
                pushButtons.forEach(pushButton => {
                  ac_buttons.push(pushButton);
                })
              })
              if ( ac_cards.length > 0 ) {
                ac_buttons.map((button) => {
                  button.addEventListener( 'click', function(event) {
                    if (event.target.onclick) {
                      button.classList.add( 'buttonClicked' );
                      const div = button.getElementsByTagName('div');
                      div[0].classList.add( 'buttonClickedDiv' );
                      let text = div[0] ? div[0] : div[0].children[0];
                      let newText = [];
                      newText.push(document.createElement('div'));
                      newText[0].classList.add( 'buttonClickedText' );
                      newText[0].innerText = text.innerText;
                      div[0].innerText = '';
                      div[0].appendChild(newText[0]);
                    }
                  });
                });
              }
              if (ac_cards.length > 1 ) {
                let index = ac_cards.length - 1;
                for (let i = 0; i <= index; i++) {
                  if (i === index) {
                    let card = ac_cards[index - 1]
                    console.log(card)
                    card.querySelectorAll( 'button' ).forEach( button => {
                      button.classList.remove( 'serviceCardHover' );
                      button.setAttribute( 'disabled', 'disabled' )
                    } );
                  }
                };
              }
            }, 300);

            if (attachments[ 0 ].content && attachments[ 0 ].content.trigger && attachments[ 0 ].content.trigger === 'cardTrigger' ) {
              setTimeout(() => {
                let cards = document.querySelectorAll( '.ac-adaptiveCard' )
                let cardLength = cards.length;
                let card = cards[ cardLength - 1 ];
                card.querySelectorAll( 'button' ).forEach(button => {
                  if (button.children[0].innerText === 'Service Details') {
                    button.classList.add('serviceCard');
                    button.classList.add('serviceCardHover');
                  }
                });
              }, 300 )
            }
          }

          if (activity.text) {
            if (activity.text.toLowerCase() === 'get me a map') {
              try {
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
                  })
                  .catch((error) => {
                    console.log(`WEB CHAT => GEOLOCATION_LOGGING_FAILED (${ error })`)
                  })
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
        let latitude;
        let longitude;
        if (activity.text) {
          if (activity.text.toLowerCase() === 'send me a map') {
            try {
                console.log('WEB_CHAT => LOGGING_GEOLOCATION')
                latitude = sessionStorage.getItem('latitude');
                longitude = sessionStorage.getItem('longitude');
                action = window.simpleUpdateIn(
                  action,
                  ['payload', 'activity', 'channelData', 'latitude' ],
                  () => Number(latitude)
                );
                action = window.simpleUpdateIn(
                  action,
                  ['payload', 'activity', 'channelData', 'longitude' ],
                  () => Number(longitude)
                );
            } catch(error) {
              console.log(`WEB CHAT => GEOLOCATION LOGGING FAILED (${ error })`)
            }
          }
          
          if (activity.text.startsWith('update activity')) {
            const text = activity.text;
            let a = text.split(' ');
            let command = a.slice(0,2).join(' ');
            let nbrString = a.slice(2).join(' ');
            let nbrStringArray = nbrString.split(' ');
            let nbr = nbrStringArray[0];
            let newText = nbrStringArray.slice(1).join(' ');
            const activityData = { command: command, activityId: nbr, text: newText };
            action = window.simpleUpdateIn(
              action,
              ['payload', 'activity', 'channelData', 'activityData' ],
              () => activityData
            );
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

  // const buttonClick = (function() {
  //   setTimeout(() => {
  //   window.addEventListener('buttonClickEvent', (e) => {
  //     const { button } = e;
  //       const card = button.closest('.ac-adaptiveCard')
  //       button.classList.add( 'buttonClicked' );
  //       const div = button.querySelector('div');
  //       div.classList.add( 'buttonClickedDiv' );
  //       let text = div.querySelector('div');
  //       if (!text) {
  //         text = document.createElement('div')
  //         text.innerText = div.innerText;
  //         div.innerText = '';
  //         div.appendChild(text);
  //       }
  //       text.classList.add( 'buttonClickedText' );
  //       card.querySelectorAll( 'button' ).forEach( button => {
  //         button.setAttribute( 'disabled', 'disabled' )
  //       } );
  //     });
  //   }, 300);
  // })();

  return publicAPIs;

})();
