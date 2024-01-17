const onIncomingMessageReaction = async (store, action) => {
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
        console.log('INCOMING_MESSAGE_REACTION ', activity);
        break;
      case 'user':
        console.log('OUTGOING_MESSAGE_REACTION ', activity);
        return false;
    }
  }
};
