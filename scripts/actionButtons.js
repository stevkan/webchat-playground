const actionButtons = (function () {
  const buttons = function (startWebChat, store, userName, getMiddleware) {
    let webChat = document.getElementById( 'webchat' );
    webChat.setAttribute( 'style', 'position: relative' );
    const chatHeader = document.createElement( 'div' );
    const chatHeaderText = document.createElement( 'div' );
    chatHeader.setAttribute( 'style', 'position: absolute; width: 35rem; background-color: rgb(34,85,85, 0.7); border-style: solid; border-color: darkcyan; border-width: 0 2px 2px 2px; justify-content: space-between;display: flex;height: fit-content;' )
    chatHeaderText.setAttribute( 'style', 'width: 6rem; background-color: rgb(34,85,85, 0.5); height: fit-content; line-height: 1.3; text-align: center;' )
    chatHeaderText.innerText = "I'm a header!";
    chatHeader.appendChild( chatHeaderText );
    const chatHeaderButton = document.createElement( 'div' );
    const sendYesBtn = document.createElement( 'button' )
    const sendNoBtn = document.createElement( 'button' )
    const sendRandomBtn = document.createElement( 'button' )
    const sendEventBtn = document.createElement( 'button' )
    sendYesBtn.setAttribute( 'style', 'color: white;background-color: rgb(116,171,242,0.7);width: 7rem;' )
    sendYesBtn.setAttribute( 'onclick', `const sendMessageEvent = new Event( 'sendMessageEvent' ); sendMessageEvent.data = { type: 'message', value: 'Yes' }; window.dispatchEvent(sendMessageEvent)` )
    sendYesBtn.setAttribute( 'id', 'sendYesBtn' )
    sendYesBtn.innerText = "Send Yes"
    sendNoBtn.setAttribute( 'style', 'color: white;background-color: rgb(71,113,168,0.7);width: 7rem;' )
    sendNoBtn.setAttribute( 'onclick', `const sendMessageEvent = new Event( 'sendMessageEvent' ); sendMessageEvent.data = { type: 'message', value: 'No' }; window.dispatchEvent(sendMessageEvent)` )
    sendNoBtn.setAttribute( 'id', 'sendNoBtn' )
    sendNoBtn.innerText = "Send No"
    sendRandomBtn.setAttribute( 'style', 'color: white;background-color: rgb(33,83,148,0.7);width: 7rem;' )
    sendRandomBtn.setAttribute( 'onclick', `const sendMessageEvent = new Event( 'sendMessageEvent' ); sendMessageEvent.data = { type: 'message', value: 'Some random text' }; window.dispatchEvent(sendMessageEvent)` )
    sendRandomBtn.setAttribute( 'id', 'sendRandomBtn' )
    sendRandomBtn.innerText = "Send Random"
    sendEventBtn.setAttribute( 'style', 'color: white;background-color: rgb(20,57,105,0.7);width: 7rem;' )
    sendEventBtn.setAttribute( 'onclick', `const sendMessageEvent = new Event( 'sendMessageEvent' ); sendMessageEvent.data = { type: 'event', name: 'send_user_geolocation', value: 'user_geolocation' }; window.dispatchEvent(sendMessageEvent)` )
    sendEventBtn.setAttribute( 'id', 'sendEventBtn' )
    sendEventBtn.innerText = "Send Event"
    chatHeaderButton.appendChild( sendYesBtn );
    chatHeaderButton.appendChild( sendNoBtn );
    chatHeaderButton.appendChild( sendRandomBtn );
    chatHeader.appendChild( chatHeaderButton );
    chatHeaderButton.appendChild( sendEventBtn );
    webChat.appendChild( chatHeader );
  
    const parent = document.getElementsByClassName( 'main' )
    const child = parent[ 0 ].children[ 2 ].getElementsByTagName( 'svg' );
    const svg = document.createElementNS( "https://www.w3.org/2000/svg", "svg" );
    const img = document.createElement( "img" );
    img.src = './images/bot - small.png';
    img.setAttribute( 'height', '28' );
    img.setAttribute( 'width', '28' );
    svg.setAttribute( 'height', '28' );
    svg.setAttribute( 'width', '28' );
    svg.appendChild( img );
    child[ 0 ].replaceWith( img ) 

    const disconnectBtn = document.getElementById( 'disconnectBtn' );

    disconnectBtn.addEventListener( 'click', () => {
      store.dispatch( {
        type: 'WEB_CHAT/SEND_MESSAGE_BACK',
        payload: {
          value: 'isLoggedOff',
          displayText: `${ userName } left the conversation`,
          text: `${ userName } left the conversation`
        }
      } );
      setTimeout(() => {
        getMiddleware.clearTimers();
        store.dispatch( {
          type: 'DIRECT_LINE/DISCONNECT'
        } )
      }, 1000);
    } )

    const reconnectBtn = document.getElementById( 'reconnectBtn' );
    
    reconnectBtn.addEventListener( 'click', async () => {
      console.log( 'WEB_CHAT >> RESTARTING_WEB_CHAT' );
      await startWebChat();
      // setTimeout(() => {
        store.dispatch( {
          type: 'DIRECT_LINE/RECONNECT'
        } )
      // }, 1000);
    } )

    const resetBtn = document.getElementById( 'resetBtn' );

    resetBtn.addEventListener( 'click', () => {
      console.log( 'WEB_CHAT >> RESETTING_DIALOG' );
      store.dispatch( {
        type: 'WEB_CHAT/SEND_MESSAGE',
        payload: {
          text: `Reset`
        }
      } )
    } )

    const reloadCssButton = document.getElementById( 'reloadCssBtn' );
    
    reloadCssButton.onclick = () => {
      (function() {
        var h, a, f;
        a = document.getElementsByTagName( 'link' );
        for ( h = 0; h < a.length; h++ ) {
          f = a[ h ];
          if ( f.rel.toLowerCase().match( /stylesheet/ ) && f.href ) {
            var g = f.href.replace( /(&|\?)rnd=\d+/, '' );
            f.href = g + ( g.match( /\?/ ) ? '&' : '?' );
            f.href += 'rnd=' + ( new Date().valueOf() );
          }
        }
      })();
    };

    const reloadBtn = document.getElementById( 'reloadBtn' );
    reloadBtn.onclick = () => {
      window.sessionStorage.removeItem( 'conversationId' );
      window.sessionStorage.removeItem( 'token' );
      window.sessionStorage.removeItem( 'streamUrl' );
      window.sessionStorage.removeItem( 'watermark' );
      caches.open( 'web-chat' )
        .then( function ( cache ) {
          return cache.delete( './playground-wc.html' );
        } );
      (function() {
        var h, a, f;
        a = document.getElementsByTagName( 'link' );
        for ( h = 0; h < a.length; h++ ) {
          f = a[ h ];
          if ( f.rel.toLowerCase().match( /stylesheet/ ) && f.href ) {
            var g = f.href.replace( /(&|\?)rnd=\d+/, '' );
            f.href = g + ( g.match( /\?/ ) ? '&' : '?' );
            f.href += 'rnd=' + ( new Date().valueOf() );
          }
        }
      })();
      location.reload( true );
    };
  }
  return buttons;
})()