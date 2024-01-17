const onReconnect = (store, action, userName) => {
  console.log('WEB_CHAT >> RECONNECTING');
  setTimeout(() => {
    store.dispatch({
      type: 'WEB_CHAT/SEND_MESSAGE_BACK',
      payload: {
        value: 'isLoggedOn',
        displayText: `${userName} rejoined the conversation`,
        text: `${userName} rejoined the conversation`,
      },
    });
    // window.dispatchEvent(buttonClickEvent);
  }, 1000);

  // await startWebChat();
  // setTimeout(() => {
  //   store.dispatch( {
  //     type: 'DIRECT_LINE/UPDATE_CONNECTION_STATUS',
  //     payload: 'ONLINE'
  // }, 1000);
};
