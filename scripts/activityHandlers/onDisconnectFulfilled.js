const onDisconnectFulfilled = (store, action, restartConversation, startWebChat) => {
  console.log('WEB_CHAT >> DISCONNECTED');
  store.dispatch({
    type: 'WEB_CHAT/SEND_MESSAGE',
    payload: {
      text: 'I just got disconnected',
    },
  });

  if (action.payload && action.payload.activity && action.payload.activity.channelData) {
    const { channelData } = action.payload.activity;
    if (channelData.action === 'logoff_received') {
    }
  }

  if (restartConversation === true) {
    setTimeout(async () => {
      await startWebChat();
      store.dispatch({
        type: 'DIRECT_LINE/RECONNECT',
      });
    }, 4000);
  }
};
