const onConnectFulfilled = (store, action) => {
  console.log('WEB_CHAT >> CONNECT_FULFILLED');
  store.dispatch({
    type: 'WEB_CHAT/SEND_EVENT',
    payload: {
      name: 'webchat/join',
      value: {
        language: window.navigator.language,
        token: localStorage.getItem('token'),
      },
    },
  });
  // store.dispatch({
  //   type: 'WEB_CHAT/SET_SEND_BOX',
  //   payload: {
  //     text: ' ',
  //   },
  // });
};
