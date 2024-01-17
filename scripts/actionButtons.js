const actionButtons = (function () {
  const buttons = function (startWebChat, store, userName, getStoreMiddleware, directLine) {
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
  
    // Helper function to simplify creating different elements
    const createElement = ( elType, id, className, option ) => {
      const el = document.createElement( elType );
      switch ( el.localName ) {
      case 'button':
        if ( id ) {
          el.setAttribute( 'id', id );
          el.setAttribute( 'type', 'button' );
        }
        if ( className ) {
          el.classList.add( className );
        }
        return el;
      case 'div':
        if ( id ) {
          el.setAttribute( 'id', id );
        }
        if (className) {
          el.classList.add( className );
        }
        if (option) {
          const style = option.style;

          el.setAttribute( 'style', style );
        }
        return el;
      case 'img':
        if ( className ) {
          el.classList.add( className );
        }
        if ( option ) {
          const src = option;
          el.src = src;
        }
        return el;
      case 'input':
        if ( id ) {
          el.setAttribute( 'id', id );
        }
        if ( className ) {
          el.className = className;
        }
        if ( option ) {
          const inputName = option.name;
          const inputType = option.type;
          const style = option.style;

          el.setAttribute( 'name', inputName );
          el.setAttribute( 'type', inputType );
          el.setAttribute( 'style', style );
        }
        return el;
      case 'p':
        if ( option ) {
          const innerText = option;
          el.innerText = innerText;
        }
        return el;
      }
    };
    
    // Gets the sendBox and locates the file attachment button
    // const parent = document.querySelector( '.main' );
    // const attachmentButton = document.querySelector( '[title="Upload file"]' );
    // if ( attachmentButton ) {
    //   var attachmentSVG = attachmentButton.firstElementChild;
    //   var attachmentParent = attachmentButton.parentElement;
    // }

    // // Changes microphone to supplied image 
    // const child = parent.querySelectorAll( 'svg' );
    // const speakBtnImage = createElement( 'img', undefined, 'mainBtnImage', './images/bot - small.png' );
    // const speakBtnContainer = document.querySelector('[title="Speak"]');
    // speakBtnContainer.setAttribute('style', 'background-color: black; margin-top: -1px; height: 41px;');

    // // Creates containers to hold menu and buttons
    // const menuContainer = createElement( 'div', 'menuContainer', undefined );
    // menuContainer.hidden = true;
    // const firstRow = createElement( 'div', 'firstRow' );
    // const secondRow = createElement( 'div', 'secondRow' );

    // const documentButton = createElement( 'div', 'documentBtn', 'menuItemSize', { style: 'display: none' } );
    // const inputFile = createElement( 'input', 'docFile', 'menuItemSize', { name: 'docFile', type: 'file', style: 'display: none' } );
    // const docImage = createElement( 'img', undefined, 'menuItemSize', './images/menuDoc.png' );
    // documentButton.appendChild( inputFile );
    // documentButton.appendChild( docImage );
    // const docLabel = createElement( 'p', undefined, undefined, 'Document' );
    // const docWrapper = createElement( 'div', undefined, 'menuItemWrapper' );
    // docWrapper.appendChild( documentButton );
    // docWrapper.appendChild( docImage );
    // docWrapper.appendChild( docLabel );
    // firstRow.appendChild( docWrapper );
    // menuContainer.appendChild( firstRow );

    // // Enables button, allows file selection, and "sends" file via postBack
    // docImage.onclick = () => { inputFile.click() };
    // inputFile.onchange = ( e ) => { handleChange( e ) };

    // const handleChange = async ( e ) => { 
    //   const file = e.target.files[0];
    //   await store.dispatch({
    //     type: 'WEB_CHAT/SEND_POST_BACK',
    //     payload: { 
    //       value: { file: file.name }
    //     }
    //   })
    // };

    // const cameraButton = createElement( 'div', 'cameraBtn', 'menuItemSize' );
    // const cameraImage = createElement( 'img', undefined, 'menuItemSize', './images/menuCamera.png' );
    // cameraButton.appendChild( cameraImage );
    // const cameraLabel = createElement( 'p', undefined, undefined, 'Camera' );
    // const cameraWrapper = createElement( 'div', undefined, 'menuItemWrapper' );
    // cameraWrapper.appendChild( cameraButton );
    // cameraWrapper.appendChild( cameraLabel );
    // firstRow.appendChild( cameraWrapper );
    // menuContainer.appendChild( firstRow );

    // const galleryButton = createElement( 'div', 'galleryBtn', 'menuItemSize' );
    // const galleryImage = createElement( 'img', undefined, 'menuItemSize', './images/menuGallery.png' );
    // galleryButton.appendChild( galleryImage);
    // const galleryLabel = createElement( 'p', undefined, undefined, 'Gallery' );
    // const galleryWrapper = createElement( 'div', undefined, 'menuItemWrapper' );
    // galleryWrapper.appendChild( galleryButton );
    // galleryWrapper.appendChild( galleryLabel );
    // firstRow.appendChild( galleryWrapper );
    // menuContainer.appendChild( firstRow );

    // const audioButton = createElement( 'div', 'audioBtn', 'menuItemSize' );
    // const audioImage = createElement( 'img', undefined, 'menuItemSize', './images/menuAudio.png' );
    // audioButton.appendChild( audioImage );
    // const audioLabel = createElement( 'p', undefined, undefined, 'Audio' );
    // const audioWrapper = createElement( 'div', undefined, 'menuItemWrapper' );
    // audioWrapper.appendChild( audioButton );
    // audioWrapper.appendChild( audioLabel );
    // secondRow.appendChild( audioWrapper );
    // menuContainer.appendChild( secondRow );

    // const locationButton = createElement( 'div', 'locationBtn', 'menuItemSize' );
    // const locationImage = createElement( 'img', undefined, 'menuItemSize', './images/menuLocation.png' );
    // locationButton.appendChild( locationImage );
    // const locationLabel = createElement( 'p', undefined, undefined, 'Location' );
    // const locationWrapper = createElement( 'div', undefined, 'menuItemWrapper' );
    // locationWrapper.appendChild( locationButton );
    // locationWrapper.appendChild( locationLabel );
    // secondRow.appendChild( locationWrapper );
    // menuContainer.appendChild( secondRow );

    // const contactButton = createElement( 'div', 'contactBtn', 'menuItemSize' );
    // const contactImage = createElement( 'img', undefined, 'menuItemSize', './images/menuContact.png' );
    // contactButton.appendChild( contactImage );
    // const contactLabel = createElement( 'p', undefined, undefined, 'Contact' );
    // const contactWrapper = createElement( 'div', undefined, 'menuItemWrapper' );
    // contactWrapper.appendChild( contactButton );
    // contactWrapper.appendChild( contactLabel );
    // secondRow.appendChild( contactWrapper );
    // menuContainer.appendChild( secondRow );

    // let transcriptWindow = document.querySelector( '[dir="ltr"]' );
    // let fosterParent = createElement( 'div' );
    // let menuButtonContainer = createElement( 'div', 'menuButtonContainer' );
    // let menuButton = createElement( 'div', 'menuButton' );
    // transcriptWindow.appendChild( menuContainer );

    // switch ( child.length ) {
    // case 1:
    //   child[0].replaceWith( speakBtnImage );

    //   fosterParent.appendChild( menuButtonContainer );
    //   let children = parent.children;
    //   Object.values( children ).map(child => {
    //     fosterParent.appendChild( child );
    //   });
    //   fosterParent.classList = parent.classList;
    //   parent.innerHTML = fosterParent.innerHTML;
    //   break;
    // case 2:
    //   child[1].replaceWith( speakBtnImage );

    //   // Recreates file attachment button that, when clicked, opens the menu
    //   menuButton.appendChild( attachmentSVG );
    //   menuButtonContainer.appendChild( menuButton );
    //   fosterParent.appendChild( menuButtonContainer );
    //   const buttonDiv = createElement( 'div' );
    //   buttonDiv.classList = attachmentButton.classList
    //   buttonDiv.setAttribute( 'title', 'Upload file' );
    //   buttonDiv.classList.remove( 'webchat__icon-button' );
    //   attachmentButton.remove();
    //   attachmentParent.appendChild( buttonDiv );

    //   buttonDiv.innerHTML = fosterParent.innerHTML;
    //   break;
    // };

    // // Gets elements for use with event listeners
    // const menuBtnContainer = document.querySelector( '#menuButtonContainer' );
    // const menuItems = document.querySelectorAll( '.menuItemSize' );
    // const menuItemButtons = [];
    
    // menuItems.forEach(item => {
    //   if ( item.localName === 'div' ) {
    //     menuItemButtons.push( item )
    //   }
    // });

    // // Shows/hides menu on file attachment button click
    // const menu = document.querySelector( '#menuContainer' );
    // menuBtnContainer.addEventListener('click', ( e ) => {
    //   e.preventDefault();
    //   switch ( menu.hidden ) {
    //   case false:
    //     menu.hidden = true;
    //     break;
    //   case true:
    //     menu.hidden = false;
    //     break;
    //   }
    //   return false;
    // });

    // // Hides menu when menu button is clicked
    // menuItemButtons.map(value => {
    //   value.addEventListener('click', () => {
    //     switch ( value.id ) {
    //     case 'documentBtn':
    //       menu.hidden = true;
    //       break;
    //     }
    //     return false;
    //   })
    // });
    
    const disconnectBtn = document.getElementById( 'disconnectBtn' );
    disconnectBtn.addEventListener( 'click', (e) => {
      e.preventDefault();
      store.dispatch( {
        type: 'WEB_CHAT/SEND_MESSAGE_BACK',
        payload: {
          value: 'isLoggedOff',
          displayText: `${ userName } left the conversation`,
          text: `${ userName } left the conversation`
        }
      } );
      setTimeout(() => {
        getStoreMiddleware.clearTimers();
        store.dispatch( {
          type: 'DIRECT_LINE/DISCONNECT'
        } )
      }, 1000);
    } )

    const expireTokenBtn = document.getElementById( 'expireTokenBtn' );
    expireTokenBtn.addEventListener( 'click', (e) => {
      e.preventDefault();
      directLine.expiredToken();
    } )

    const reconnectBtn = document.getElementById( 'reconnectBtn' );
    reconnectBtn.addEventListener( 'click', async (e) => {
      e.preventDefault();
      console.log( 'WEB_CHAT >> RESTARTING_WEB_CHAT' );
      await startWebChat();
      // setTimeout(() => {
        store.dispatch( {
          type: 'DIRECT_LINE/RECONNECT'
        } )
      // }, 1000);
    } )

    const resetBtn = document.getElementById( 'resetBtn' );
    resetBtn.addEventListener( 'click', (e) => {
      e.preventDefault();
      console.log( 'WEB_CHAT >> RESETTING_DIALOG' );
      store.dispatch( {
        type: 'WEB_CHAT/SEND_MESSAGE',
        payload: {
          text: `Reset`
        }
      } )
    } )

    const reloadCssBtn = document.getElementById( 'reloadCssBtn' );
    reloadCssBtn.onclick = (e) => {
      e.preventDefault();
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
    reloadBtn.onclick = (e) => {
      e.preventDefault();
      window.localStorage.removeItem( 'conversationId' );
      window.localStorage.removeItem( 'token' );
      window.localStorage.removeItem( 'streamUrl' );
      window.localStorage.removeItem( 'watermark' );
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

    // const buttonClick = (function() {
    //   window.addEventListener('click', (e) => {
    //     let card = e.target.closest('.ac-adaptiveCard');
    //     card.querySelectorAll( 'button' ).forEach( button => {
    //       button.setAttribute( 'disabled', 'disabled' )
    //       if (e.target === button) {
    //         button.setAttribute( 'style', 'background-color: orange !important;' );
    //       }
    //     } );
    //   });
    // })()
  }
  return buttons;
})()