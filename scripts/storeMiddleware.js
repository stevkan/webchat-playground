let timers = [];
let userKeyInput = '';
let streamUrl;
let ws;
let restartConversation = false;
let connectionType;

const getStoreMiddleware = (function () {
  'use strict';

  let publicAPIs = {};

  publicAPIs.storeMiddleware = async function (
    store,
    next,
    action,
    userName,
    mapMaker,
    helpers,
    window,
    startWebChat,
    directLine,
  ) {
    publicAPIs.store = store;
    publicAPIs.helpers = helpers;
    const document = window.document;
    const i18next = window.i18next;

    publicAPIs.clearTimers = () => {
      for (let t of timers) {
        clearInterval(t);
        timers.pop(t);
      }
    };

    let location;

    // getButtons()
    // function getButtons() {
    //   setTimeout(() => {
    // let pushButtons = [];
    // document.querySelectorAll('.ac-pushButton').forEach(button => {
    //   pushButtons.push(button);
    // })

    //     for (let button of pushButtons) {
    //       button.addEventListener('click', (event) => {
    //         console.log(event)
    //         if (button.children[0].id === 'buttonOuterDiv'){
    //           button.classList.add( 'buttonClicked' );
    //           button.children[0].classList.add( 'buttonClickedDiv' );
    //           button.children[0].children[0].classList.add( 'buttonClickedText' );
    //           getButtons();
    //         }
    //         if (button.children[0].classList.contains('buttonClicked')){
    //           button.classList.remove( 'buttonClicked' );
    //           button.children[0].classList.remove( 'buttonClickedDiv' );
    //           button.children[0].children[0].classList.remove( 'buttonClickedText' );
    //         }
    //       })
    //       return;
    //     }
    //   }, 300);
    // }
    // for (let button of pushButtons) {
    //       document.addEventListener('mouseup', (event) => {
    //         console.log(event.target)
    //         if (event.target) {
    //           if (event.target.classList.contains('buttonClicked')){
    //             // console.log('BUTTON 1 ', button)
    //             event.target.classList.remove( 'buttonClicked' );
    //             event.target.children[0].classList.remove('buttonClickedDiv');
    //             event.target.children[0].children[0].classList.remove('buttonClickedText');
    //             return
    //           }
    //           if (!event.target.classList.contains('buttonClicked')) {
    //             // console.log('BUTTON 2 ', button)
    //             event.target.classList.add( 'buttonClicked' );
    //             event.target.children[0].classList.add( 'buttonClickedDiv' );
    //             event.target.children[0].children[0].classList.add( 'buttonClickedText' );
    //             return;
    //           }
    //         }
    //       })
    //     // }
    //     // getButtons();
    //   }, 300);
    // }

    const resource = {
      app: {
        name: 'i18next',
      },
    };

    switch (action.type) {
      case 'DIRECT_LINE/CONNECT':
        onConnect(store, action);
        // streamUrl = action.payload.directLine.streamUrl;
        if (action.payload?.directLine?.connectionStatus$) {
          action.payload.directLine.connectionStatus$.subscribe(connectionStatus => {
            let connectionType;
            switch (connectionStatus) {
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
                return console.log(
                  `DIRECT_LINE >> UNKNOWN_CONNECTION_STATUS: ${connectionStatus} - Expected a number, received a string`,
                );
            }
            console.log(`DIRECT_LINE >> CONNECTED_CONNECTION_STATUS: ${connectionType}`, action);
          });
        }
        console.log(localStorage.getItem('streamUrl'));
        ws = new WebSocket(localStorage.getItem('streamUrl'));
        ws.onopen = e => console.log('CUSTOM WEB SOCKET >> OPEN ', e);
        ws.onclose = e => console.log('CUSTOM WEB SOCKET >> CLOSED ', e);
        ws.onerror = e => console.log('CUSTOM WEB SOCKET >> ERROR ', e);
        return next(action);
      case 'DIRECT_LINE/CONNECT_FULFILLED':
        console.log('CONNECT_FULFILLED: ', action);
        setTimeout(() => {
          onConnectFulfilled(store, action);
        }, 1000);
        return next(action);
      case 'DIRECT_LINE/CONNECT_FULFILLING':
        console.log('CONNECT_FULFILLING: ', action);
        return next(action);
      case 'DIRECT_LINE/CONNECT_PENDING':
        console.log('CONNECT_PENDING: ', action);
        return next(action);
      case 'DIRECT_LINE/CONNECTION_STATUS_UPDATE':
        console.log('CONNECTION_STATUS_UPDATE: ', action);
        return next(action);
      case 'DIRECT_LINE/DISCONNECT':
        disconnectMsg(WebChatConnectedStatus.DISCONNECT);
        return next(action);
      case 'DIRECT_LINE/DISCONNECT_FULFILLED':
        onDisconnectFulfilled(store, action, restartConversation, startWebChat);
        restartConversation = false;
        return next(action);
      case 'DIRECT_LINE/DISCONNECT_PENDING':
        onDisconnectPending(store, action);
        return next(action);
      case 'DIRECT_LINE/INCOMING_ACTIVITY':
        const activityType = action.payload.activity.type;
        switch (activityType) {
          case 'endOfConversation':
            onEndOfConversation(store, action);
            break;
          case 'event':
            onIncomingEvent(store, action);
            break;
          case 'message':
            onIncomingMessage(store, action);
            break;
          case 'messageReaction':
            onIncomingMessageReaction(store, action);
            break;
          default:
            break;
        }
        return next(action);
      case 'DIRECT_LINE/POST_ACTIVITY':
        try {
          onPostActivity(store, action);
        } catch (error) {
          console.log('ERROR POSTING ACTIVITY => ', error);
          break;
        }
        return next(action);
      case 'DIRECT_LINE/POST_ACTIVITY_FULFILLED':
        console.log('POST_ACTIVITY_FULFILLED ', action);
        return next(action);
      case 'DIRECT_LINE/POST_ACTIVITY_PENDING':
        console.log('POST_ACTIVITY_PENDING ', action);
        return next(action);
      case 'DIRECT_LINE/QUEUE_INCOMING_ACTIVITY':
        console.log('QUEUE_INCOMING_ACTIVITY: ', action);
        return next(action);
      case 'DIRECT_LINE/RECONNECT':
        onReconnect(store, action, userName);
        // ws = new WebSocket(localStorage.getItem('streamUrl'));
        // ws.onopen = (e) => console.log('socket open ', e)
        // ws.onclose = (e) => {
        //   console.log('socket closed ', e)
        //   store.dispatch({
        //     type: 'DIRECT_LINE/DISCONNECT'
        //   })
        // }
        // ws.onerror = (e) => console.log('socket error ', e)
        return next(action);
      case 'DIRECT_LINE/UPDATE_CONNECTION_STATUS':
        if (action?.payload?.connectionStatus) {
          let connectionStatus = action.payload.connectionStatus;
          let restartConversation;

          switch (connectionStatus) {
            // case 2:
            //   store.dispatch({
            //     type: 'DIRECT_LINE/CONNECTING',
            //   });
            //   break;
            case 3: // connectionStatus === 'TOKEN_EXPIRED'
              disconnectMsg(WebChatConnectedStatus.DISCONNECT);
              await setTimeout(() => {
                restartConversation = confirm(
                  'Your session has expired. Would you like to start again?',
                );
                console.log('HERERERERE');
                if (restartConversation === true) {
                  disconnectMsg(WebChatConnectedStatus.CONNECT);
                  setTimeout(() => {
                    startWebChat();
                    restartConversation = false;
                  }, 1000);
                }
              }, 1000);
              break;
          }
        }
        return next(action);
      case 'WEB_CHAT/MARK_ACTIVITY':
        console.log('MARK_ACTIVITY ', action);
        return next(action);
      case 'WEB_CHAT/SEND_EVENT':
        console.log('SEND_EVENT ', action);
        return next(action);
      case 'WEB_CHAT/SEND_FILES':
        console.log('SEND_FILES ', action);
        return next(action);
      case 'WEB_CHAT/SET_LANGUAGE':
        console.log('SET_LANGUAGE ', action);
        return next(action);
      case 'WEB_CHAT/SET_DICTATE_INTERIMS':
        console.log('SET_DICTATE_INTERIMS ', action);
        if (action?.payload?.dictateInterims) {
          i18next.t(resource.app); //(action.payload.dictateInterims[0]);
        }
        return next(action);
      case 'WEB_CHAT/SET_DICTATE_STATE':
        console.log('SET_DICTATE_STATE ', action);
        return next(action);
      case 'WEB_CHAT/SET_NOTIFICATION':
        console.log('SET_NOTIFICATION ', action);
        return next(action);
      case 'WEB_CHAT/SET_REFERENCE_GRAMMAR_ID':
        console.log('SET_REFERENCE_GRAMMAR_ID ', action);
        return next(action);
      case 'WEB_CHAT/SET_SEND_BOX':
        console.log('SET_SEND_BOX ', action);
        return next(action);
      case 'WEB_CHAT/SEND_MESSAGE':
        console.log('SEND_MESSAGE ', action);
        return next(action);
      case 'WEB_CHAT/SEND_MESSAGE_BACK':
        console.log('SEND_MESSAGE_BACK ', action);
        return next(action);
      case 'WEB_CHAT/SEND_POST_BACK':
        console.log('SEND_POST_BACK ', action);
        return next(action);
      case 'WEB_CHAT/SET_SEND_TYPING_INDICATOR':
        console.log('SET_SEND_TYPING_INDICATOR ', action);
        return next(action);
      case 'WEB_CHAT/SET_SUGGESTED_ACTIONS':
        console.log('SET_SUGGESTED_ACTIONS ', action);
        return next(action);
      case 'WEB_CHAT/START_DICTATE':
        console.log('START_DICTATE ', action);
        return next(action);
      case 'WEB_CHAT/STOP_DICTATE':
        document.getElementsByTagName('body')[0].onkeyup = function (e) {
          const ev = e || event;
          const ignoreKeys = [
            'ArrowDown',
            'ArrowLeft',
            'ArrowRight',
            'ArrowUp',
            'Backspace',
            'Delete',
            'End',
            'Enter',
            'Home',
            'PageDown',
            'PageUp',
          ];
          if (ev.keyCode && ev.location === 0) {
            if (!ignoreKeys.includes(ev.key)) {
              userKeyInput = userKeyInput.concat(ev.key);
            }
          }
        };

        if (action['@@redux-saga/SAGA_ACTION']) {
          if (userKeyInput.length > 0) {
            console.log('SAGA_ACTION: ', userKeyInput);
          }
          userKeyInput = '';
          console.log('STOP_DICTATE ', action);
        }
        return next(action);
      case 'WEB_CHAT/START_SPEAKING':
        console.log('START_SPEAKING: ', action);
        return next(action);
      case 'WEB_CHAT/STOP_SPEAKING':
        console.log('STOP_SPEAKING: ', action);
        return next(action);
      case 'WEB_CHAT/SUBMIT_SEND_BOX':
        console.log('SUBMIT_SEND_BOX: ', action);
        return next(action);
      default:
        console.log('UNDEFINED ACTION ', action);
        return next(action);
    }
  };

  const sendMessageEvent = (function () {
    window.addEventListener('sendMessageEvent', async event => {
      let {
        data,
        data: { type, name, value },
      } = event;
      if (type === 'message') {
        await publicAPIs.store.dispatch({
          type: 'WEB_CHAT/SEND_MESSAGE',
          payload: {
            text: `${value}`,
          },
        });
      }

      if (type === 'event') {
        await publicAPIs.helpers.geoLoc(name, value, publicAPIs.store);
      }
    });
  })();

  // const buttonClick = (function() {
  //   setTimeout(() => {
  //     window.addEventListener('buttonClickEvent', (e) => {
  //       const { button } = e;
  //       const card = button.closest('.ac-adaptiveCard')
  //       // button.classList.add( 'buttonClicked' );
  //       // const div = button.querySelector('div');
  //       // div.classList.add( 'buttonClickedDiv' );
  //       // let text = div.querySelector('div');
  //       // if (!text) {
  //       //   text = document.createElement('div')
  //       //   text.innerText = div.innerText;
  //       //   div.innerText = '';
  //       //   div.appendChild(text);
  //       // }
  //       // text.classList.add( 'buttonClickedText' );
  //       card.querySelectorAll( 'button' ).forEach( button => {
  //         button.setAttribute( 'disabled', 'disabled' )
  //       } );
  //     });
  //   }, 300);
  // })();

  return publicAPIs;
})();

const disconnectMsg = status => {
  let webchat = document.getElementById('webchat');
  let noWebchat = document.getElementById('noWebchat');
  if (status === WebChatConnectedStatus.CONNECT) {
    webchat.style.display = 'flex';
    noWebchat.style.display = 'none';
  }
  if (status === WebChatConnectedStatus.DISCONNECT) {
    noWebchat.style = webchat.style;
    noWebchat.innerHTML = webchat.innerHTML;
    const transcriptWindow = noWebchat.querySelector('.webchat__basic-transcript');
    transcriptWindow.innerHTML =
      '<div class="divDisconnected"><div class="disconnected">Web Chat Disconnected</div></div>';
    webchat.style.display = 'none';
    noWebchat.style.display = 'flex';
  }
};
