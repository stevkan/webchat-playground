const onEndOfConversation = async (store, action) => {
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
      console.log('END_OF_CONVERSATION_BOT ', activity);
      break;
    case 'user':
      console.log('END_OF_CONVERSATION_USER', activity);
      break;
  }

  // ACTIVITY.TYPE (EVENT)
  if (activity.type === 'endOfConversation') {
    if (activity.from.role !== 'user') {
      try {
        console.log('WEB_CHAT => END_OF_CONVERSATION_RECEIVED');
        store.getState().activities = [];
      } catch (error) {
        console.log(`WEB_CHAT => END_OF_CONVERSATION_FAILED (${error})`);
      }
    }
  }
};
