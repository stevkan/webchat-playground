'use strict';

const styleOptions = (function () {
  const setOptions = {
    backgroundColor: '#19194d',

    bubbleMaxWidth: 650,

    // bubble: {
    bubbleAttachmentBackground: 'grey',
    bubbleAttachmentBorderColor: 'white',
    bubbleAttachmentBorderRadius: 9,
    bubbleAttachmentBorderStyle: 'solid',
    bubbleAttachmentBorderWidth: 2,
    bubbleAttachmentTextColor: 'red',

    bubbleAttachmentButtonBackground: 'orange',
    bubbleAttachmentButtonBorderColor: 'purple',
    bubbleAttachmentButtonColor: 'green',

    bubbleBackground: 'black',
    bubbleBorderColor: 'red',
    bubbleBorderRadius: 9,
    bubbleBorderWidth: 2,
    bubbleTextColor: 'white',
    bubbleNubSize: 5,
    bubbleNubOffset: 0,

    bubbleFromUserBackground: 'black',
    bubbleFromUserBorderColor: 'green',
    bubbleFromUserBorderRadius: 9,
    bubbleFromUserBorderWidth: 2,
    bubbleFromUserTextColor: 'white',
    bubbleFromUserNubSize: 5,
    bubbleFromUserNubOffset: 'top',

    // },

    hideSendBox: false,
    hideUploadButton: false,
    sendBoxBackground: 'white',

    // avatar: {
    botAvatarInitials: 'BB',
    botAvatarImage:
      'https://botberg81bd.blob.core.windows.net/images/bot40.jpg?sv=2020-08-04&st=2021-11-23T22%3A30%3A19Z&se=2031-11-24T22%3A30%3A00Z&sr=b&sp=r&sig=d1snpqDu0OpH7kcXfH7ieE5C0zKbfjQflmn3MJZ2IEM%3D',
    userAvatarInitials: 'SK',
    userAvatarImage:
      'https://botberg81bd.blob.core.windows.net/images/me40.jpg?sv=2020-08-04&st=2021-11-23T22%3A32%3A02Z&se=2031-11-24T22%3A32%3A00Z&sr=b&sp=r&sig=ZeJiiMDm5lI25BDSQLoc3JSwfD60rqOkfhimsnTeQ8g%3D',
    showAvatarInGroup: false,
    // },

    // spinnerAnimationBackgroundImage: './images/Small-Bot-40x40.gif',
    // spinnerAnimationHeight: 16,
    // spinnerAnimationWidth: 16,
    // spinnerAnimationPadding: 12,

    suggestedActionBackgroundColor: 'White',
    suggestedActionBorderColor: 'Orange',
    suggestedActionBorderRadius: 4,
    suggestedActionBorderStyle: 'solid',
    suggestedActionBorderWidth: 1,
    suggestedActionHeight: 32,
    suggestedActionLayout: 'stacked', // either "carousel" or "stacked"
    // sendTimeout: 20000,
  };

    // setOptions.bubble = {
    //   bubbleAttachmentBackground: 'grey',
    //   bubbleAttachmentBorderColor: 'white',
    //   bubbleAttachmentBorderRadius: 9,
    //   bubbleAttachmentBorderStyle: 'solid',
    //   bubbleAttachmentBorderWidth: 2,
    //   bubbleAttachmentTextColor: 'red',

    //   bubbleAttachmentButtonBackground: 'orange',
    //   bubbleAttachmentButtonBorderColor: 'purple',
    //   bubbleAttachmentButtonColor: 'green',

    //   bubbleBackground: 'black',
    //   bubbleBorderColor: 'red',
    //   bubbleBorderRadius: 9,
    //   bubbleBorderWidth: 2,
    //   bubbleTextColor: 'white',
    //   bubbleNubSize: 5,
    //   bubbleNubOffset: 0,

    //   bubbleFromUserBackground: 'black',
    //   bubbleFromUserBorderColor: 'green',
    //   bubbleFromUserBorderRadius: 9,
    //   bubbleFromUserBorderWidth: 2,
    //   bubbleFromUserTextColor: 'white',
    //   bubbleFromUserNubSize: 5,
    //   bubbleFromUserNubOffset: 'top',
    // };
  return setOptions;
})();
