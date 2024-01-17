const onConnect = (store, action) => {
  console.log('WEB_CHAT >> CONNECTED');
  disconnectMsg(WebChatConnectedStatus.CONNECT);
  //   } )
  store.dispatch({
    type: 'DIRECT_LINE/UPDATE_CONNECTION_STATUS',
    payload: {
      connectionStatus: 'ONLINE',
    },
  });
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
  // // }, activeCountdown );
  // }, 7000 );
};