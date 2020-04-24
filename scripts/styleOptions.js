'use strict';

const styleOptions = (function () {
  const setOptions = function () {
    return {
            backgroundColor: '#19194d',
  
            bubbleMaxWidth: 650,
  
            bubbleAttachmentBackground: 'grey',
            bubbleAttachmentBorderColor: 'white',
            bubbleAttachmentBorderRadius: 9,
            bubbleAttachmentBorderStyle: 'solid',
            bubbleAttachmentBorderWidth: 2,
            bubbleAttachmentTextColor: 'red',
  
            bubbleAttachmentButtonBackground: 'orange',
            bubbleAttachmentButtonBorderColor: 'purple',
            bubbleAttachmentButtonColor: 'green',
  
            bubbleBackground: "black",
            bubbleBorderColor: 'red',
            bubbleBorderRadius: 9,
            bubbleBorderWidth: 2,
            bubbleTextColor: 'white',
            bubbleNubSize: 5,
            bubbleNubOffset: 'bottom',
  
            bubbleFromUserBackground: 'black',
            bubbleFromUserBorderColor: 'green',
            bubbleFromUserBorderRadius: 9,
            bubbleFromUserBorderWidth: 2,
            bubbleFromUserTextColor: 'white',
            bubbleFromUserNubSize: 5,
            bubbleFromUserNubOffset: 0,
  
            hideSendBox: false,
            hideUploadButton: false,
            sendBoxBackground: 'white',
  
            botAvatarInitials: 'BB',
            botAvatarImage: './images/bot40.jpg',
            userAvatarInitials: 'SK',
            userAvatarImage: './images/me40.jpg',
    }
  }
  return setOptions;
})();
