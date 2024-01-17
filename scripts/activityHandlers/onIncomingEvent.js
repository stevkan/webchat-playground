const onIncomingEvent = async (store, action) => {
  const {
    activity,
    activity: {
      channelData,
      from: { role },
    },
  } = action.payload;

  // Console logs activity by role
  switch (role) {
    case 'bot':
      console.log('INCOMING_EVENT ', activity);
      break;
    case 'user':
      console.log('OUTGOING_EVENT ', activity);
      break;
  }

  // ACTIVITY.TYPE (EVENT)
  if (activity.type === 'event') {
    if (activity.from.role === 'user') {
      if (activity.name === 'webchat/join' || activity.text) {
        try {
          console.log('WEB_CHAT => GETTING_GEOLOCATION');
          const name = 'get_geolocation';
          await helpers.geoLoc(name);
        } catch (error) {
          console.log(`WEB_CHAT => GEOLOCATION_LOGGING_FAILED (${error})`);
        }
      }
      if (activity.name === 'hideSendBox') {
        document.getElementsByClassName('webchat__send-box__main')[0].style.visibility = 'hidden';
      } else if (activity.name === 'showSendBox') {
        document.getElementsByClassName('webchat__send-box__main')[0].style.visibility = 'visible';
      }
    }
    if (activity.name === 'sendWindowsNotification') {
      function showNotification() {
        return new Notification('Message from bot', {
          body: activity.value,
          icon: './images/bot40.jpg',
        });
      }
      if (Notification.permission === 'granted') {
        showNotification();
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showNotification();
          }
        });
      }
    } 
    if (activity.name === 'messageReactionReceived') {
      console.log('CUSTOM EVENT RECEIVED');
      return store.dispatch({
        type: 'WEB_CHAT/SEND_MESSAGE_BACK',
        payload: {
          value: 'receivedMessageReaction',
          displayText: 'Received Message Reaction',
          text: `${userName} rejoined the conversation`,
        },
      });
    }
  }
};
