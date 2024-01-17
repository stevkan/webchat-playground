const onPostActivity = (store, action) => {
  if (action.payload && action.payload.activity) {
    const {
      activity,
      activity: { from },
    } = action.payload;
    let latitude;
    let longitude;
    if (activity.text) {
      if (activity.text.toLowerCase() === 'send me a map') {
        try {
          console.log('WEB_CHAT => LOGGING_GEOLOCATION');
          latitude = localStorage.getItem('latitude');
          longitude = localStorage.getItem('longitude');
          action = window.simpleUpdateIn(
            action,
            ['payload', 'activity', 'channelData', 'latitude'],
            () => Number(latitude)
          );
          action = window.simpleUpdateIn(
            action,
            ['payload', 'activity', 'channelData', 'longitude'],
            () => Number(longitude)
          );
        } catch (error) {
          console.log(`WEB_CHAT => GEOLOCATION_LOGGING_FAILED (${error})`);
        }
      }

      if (activity.text.toLowerCase() === 'health check') {
        try {
          console.log('WEB_CHAT => REQUESTING_HEALTH_CHECK');
          action = window.simpleUpdateIn(
            action,
            ['payload', 'activity', 'type'],
            () => 'healthCheck'
          );
        } catch (error) {
          console.log(`WEB_CHAT => HEALTH_CHECK_REQUEST_FAILED`);
        }
      }

      if (activity.text.startsWith('update activity')) {
        const text = activity.text;
        let a = text.split(' ');
        let command = a.slice(0, 2).join(' ');
        let nbrString = a.slice(2).join(' ');
        let nbrStringArray = nbrString.split(' ');
        let nbr = nbrStringArray[0];
        let newText = nbrStringArray.slice(1).join(' ');
        const activityData = { command: command, activityId: nbr, text: newText };
        action = window.simpleUpdateIn(
          action,
          ['payload', 'activity', 'channelData', 'activityData'],
          () => activityData
        );
      }
    }
  }
};
