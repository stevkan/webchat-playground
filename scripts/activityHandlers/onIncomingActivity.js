const onIncomingMessage = async (store, action) => {
  if (action.payload && action.payload.activity) {
    const {
      activity,
      activity: {
        attachments,
        channelData,
        from: { role },
        name,
      },
    } = action.payload;

    // Console logs activity by role
    switch (role) {
      case 'bot':
        console.log('INCOMING_ACTIVITY ', activity);
        break;
      case 'user':
        console.log('OUTGOING_ACTIVITY ', activity);
        break;
    }

    // // Caches page - experimental
    // caches.open('web-chat').then(function (cache) {
    //   return cache.add('./playground-wc.html');
    // });

    // ACTIVITY.CHANNELDATA
    if (channelData && channelData.action) {
      if (channelData.action === 'dialog_reset') {
        store.dispatch({
          type: 'WEB_CHAT/SEND_MESSAGE',
          payload: {
            text: 'Diaalloggg...START!',
          },
        });
      }
    }

    function refreshTimer() {
      getStoreMiddleware.clearTimers();
      const timer = setInterval(async () => {
        const status = await startServices();
        if (!!status.connectionError) {
          console.log(`WEB_CHAT >> INTERNET_DISCONNECTED (${status.connectionError})`);
          getStoreMiddleware.clearTimers();
        }
      }, 1500000);
      timers.push(timer);
    }

    // ACTIVITY.FROM.ROLE (BOT)
    if (activity.from.role === 'bot') {
      // if (activity.channelData & activity.channelData.trigger && activity.channelData.trigger === 'powerBITrigger') {
      //     store.dispatch({
      //       type: 'WEB_CHAT/SEND_MESSAGE_BACK',
      //       payload: {
      //         text: 'message back',
      //         value: 'message back'
      //       }
      //     })
      //   }
      if (
        attachments &&
        attachments[0] &&
        attachments[0].content?.trigger &&
        attachments[0].content?.trigger === 'powerBITrigger'
      ) {
        setTimeout(() => {
          let children = document.getElementsByClassName('ac-adaptiveCard');
          for (let i = 0, j = children.length; i <= j; i++) {
            if (i === j - 1) {
              let child = children[i];
              if (child.lastChild.innerHTML.includes('Click to send')) {
                child.id = 'cardPowerBI';
                child.lastChild.innerHTML +=
                  '<iframe src="https://app.powerbi.com/reportEmbed?reportId=e5536790-5e4f-40db-bcc8-afbd591fc6b4&autoAuth=true&ctid=8af59001-d23c-4c4f-9e49-eca878ce569f&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly93YWJpLXVzLXdlc3QyLXJlZGlyZWN0LmFuYWx5c2lzLndpbmRvd3MubmV0LyJ9" frameborder="0" allowFullScreen="true"></iframe>';
              }
            }
          }
        }, 400);
      }
    }

    // ACTIVITY.TYPE (EVENT or MESSAGE)
    if (activity.type === 'event' || activity.type === 'message') {
      if (activity.from.role === 'user') {
        // refreshTimer();
      }
    }

    // ACTIVITY.TYPE (POSTBACK)
    if (
      activity.type === 'postBack' &&
      activity.channelData &&
      activity.channelData.updateActivity
    ) {
      // setTimeout(() => {
      const updateActivity = JSON.parse(activity.channelData.updateActivity);
      const idIndex = updateActivity.id.indexOf('|');
      const updateActivityId = updateActivity.id.substr(idIndex + 1);

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

    // ACTIVITY.TYPE (END OF CONVERSATION)
    if (activity.type === 'endOfConversation') {
      store.dispatch({
        type: 'WEB_CHAT/SEND_MESSAGE',
        payload: {
          text: 'Closing Web Chat',
        },
      });
    }

    // ACTIVITY.TYPE (MESSAGE)
    if (activity.type === 'message') {
      if (activity.value && activity.value === 'sendBox') {
        store.dispatch({
          type: 'WEB_CHAT/SET_SEND_BOX',
          payload: { text: 'Hello from Web Chat!' },
        });
      }

      if (activity.text || activity.attachments) {
        const userMessages = document.querySelectorAll('.from-user .webchat__bubble__content');
        const userMessageLength = userMessages.length;
        if (userMessageLength > 0) {
          const userMessage = userMessages[userMessageLength - 1];
          const idIndex = activity.id.indexOf('|');
          const activityId = activity.id.substr(idIndex + 1);
          userMessage.setAttribute('activityid', activityId);
        }
      }

      // Saves watermark in localStorage
      const index = activity.id.indexOf('|');
      const watermarkString = activity.id.substr(index + 1);
      let watermark = Number(watermarkString);

      switch (watermark > 9) {
        case true:
          let newWatermark = watermark - 10;
          if (newWatermark > localStorage.getItem('watermark')) {
            localStorage.setItem('watermark', newWatermark);
          }
          break;
        default:
          localStorage.setItem('watermark', 0);
      }

      // Update card button text
      const ac_pushButtons = document.querySelectorAll('.ac-pushButton');
      for (let i = 0; i <= ac_pushButtons.length - 1; i++) {
        if (
          ac_pushButtons[i].children[0].nodeName === 'DIV' &&
          ac_pushButtons[i].children[0].innerHTML === 'Placeholder Message'
        ) {
          ac_pushButtons[i].children[0].innerHTML = '<div>Service Details</div>';
          // ac_pushButtons[i].children[0].innerHTML = '<div><div>Service details</div><br />\"Service details for PC request\"</div> '
          continue;
        }
      }

      // ACTIVITY.ATTACHMENTS
      if (attachments && attachments[0]) {
        switch (attachments[0].content?.contentType) {
          case 'application/vnd.microsoft.card.adaptive':
            // setTimeout(() => {
            //   let newText = [];
            //   const buttons = document.querySelectorAll('.ac-pushButton')
            //     .forEach(button => {
            //       const div = button.getElementsByTagName('div');
            //       let text = div[0] ? div[0] : div[0].children[0];
            //       let newDiv = document.createElement('div');
            //       newText.push(newDiv);
            //       newText[0].id = 'buttonInnerDiv';
            //       newText[0].innerText = text.innerText;
            //       div[0].id = 'buttonOuterDiv';
            //       div[0].innerText = '';
            //       div[0].appendChild(newText[0]);
            //     })

            //   const ac_cards = document.querySelectorAll( '.ac-adaptiveCard' )
            //   if (ac_cards && ac_cards.length > 1 ) {
            //     let index = ac_cards.length - 1;
            //     // if (!!ac_cards.querySelectorAll('.ac-adaptiveCard')) {

            //     // }
            //     for (let i = 0; i <= index; i++) {
            //       if (i === index) {
            //         let card = ac_cards[index - 1]
            //         console.log(card)
            //         card.querySelectorAll( 'button' ).forEach( button => {
            //           button.classList.remove( 'serviceCardHover' );
            //           button.setAttribute( 'disabled', 'disabled' )
            //         } );
            //       }
            //     };
            //   }
            // }, 300);

            if (
              attachments[0].content &&
              attachments[0].content.trigger &&
              attachments[0].content.trigger === 'cardTrigger'
            ) {
              setTimeout(() => {
                let cards = document.querySelectorAll('.ac-adaptiveCard');
                let cardLength = cards.length;
                let card = cards[cardLength - 1];
                card.querySelectorAll('button').forEach(button => {
                  if (button.children[0].innerText === 'Service Details') {
                    button.classList.add('serviceCard');
                    button.classList.add('serviceCardHover');
                  }
                });
              }, 300);
            }
            break;
          case 'application/vnd.microsoft.card.hero':
            if (activity.channelData && activity.channelData.value === 'contactCard') {
              dispatch({
                type: 'WEB_CHAT/SEND_EVENT',
                payload: {
                  value: true,
                },
              });
            }
        }
      }

      // ACTIVITY.TEXT
      if (activity.text) {
        if (activity.text === 'clear chat') {
          const webChatState = await store.getState();
          webChatState.activities = [];
          console.log('webChatState ', store.dispatch);
        }

        if (activity.from.role === 'user') {
          const chatReceived = document.querySelector('.chatReceived');
          chatReceived.innerHTML = activity.text;
        }

        if (activity.text.toLowerCase() === 'get me a map') {
          try {
            console.log('WEB _HAT => LOGGING_GEOLOCATION');
            const location = new Promise((resolve, reject) => {
              let result = mapMaker(store);
              if (result) {
                resolve();
              } else {
                reject();
              }
            });

            location
              .then(() => {
                const myMap = document.getElementById('myMap');
                myMap.setAttribute('style', 'height: 60vh; width: 60vw;');
              })
              .catch(error => {
                console.log(`WEB_CHAT => GEOLOCATION_LOGGING_FAILED (${error})`);
              });
          } catch (error) {
            console.log(`WEB_CHAT => GEOLOCATION_LOGGING_FAILED (${error})`);
          }
        }
        if (activity.text.toLowerCase() === 'password prompt') {
          store.dispatch({
            type: 'WEB_CHAT/SET_SEND_BOX',
            payload: { text: 'password_input' },
          });
        }
        if (activity.text.toLowerCase() === 'stop speaking.') {
          store.dispatch({
            type: 'WEB_CHAT/STOP_SPEAKING',
          });
        }
      }
    }
  }

  // Scrolls transcript window to bottom of page after an activity passes thru.
  setTimeout(() => {
    document
      .querySelector('.webchat__basic-transcript__transcript')
      .scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, 500);
};
