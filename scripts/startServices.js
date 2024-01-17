const startServices = (function () {
  'use strict';

  let errorCode;
  let language;
  const process = async function (directLine, serviceType, getToken, username, error) {
    if ( localStorage.getItem( 'token' ) ) {
      switch (serviceType) {
        case 'reconnect':
          try {
            const connectionError = await APIService.callService( 'reconnect', getToken );
            if (!!connectionError) {
              return { connectionError: connectionError};
            }

            console.groupCollapsed( 'DIRECT_LINE >> RECONNECTING >> CONVERSATION_ID_RETRIEVED' );
            console.log( localStorage.getItem( 'conversationId' ) );
            console.groupEnd();
            await reconnectDirectLine();
          } catch (error) {
            console.error( 'DIRECT_LINE >> RECONNECTING >> CONVERSATION_ID_ERROR', error );
          }
          break;
        default:
          try {
            const connectionError = await APIService.callService( 'refresh', getToken );
            if (!!connectionError) {
              return { connectionError: connectionError};
            }
            console.groupCollapsed( 'DIRECT_LINE >> REFRESHING_TOKEN' );
            console.log( localStorage.getItem( 'token' ) );
            console.groupEnd();
            await connectDirectLine();
          } catch (error) {
            console.error( 'DIRECT_LINE >> TOKEN_REFRESH_ERROR ', error );
          }
      }
    }
    if (!localStorage.getItem( 'token' ) && serviceType === 'speech') {
      try {
        let credentials = await APIService.callService( 'speech' )
        const webSpeechPonyfillFactory = await window.WebChat.createCognitiveServicesSpeechServicesPonyfillFactory( {
          credentials: { authorizationToken: credentials.authorizationToken, region: credentials.region }
        } );
        if (!webSpeechPonyfillFactory) {
          console.log('DIRECT_LINE >> SPEECH_CONNECTION_ERROR', )
          return { connectionError: webSpeechPonyfillFactory};
        }
        console.log( 'DIRECT_LINE >> ACQUIRING_SPEECH_TOKEN' );
        return webSpeechPonyfillFactory;
      } catch (error) {
        console.error( 'DIRECT_LINE >> SPEECH_TOKEN_ERROR ', error );
      }
    }
    if ( !localStorage.getItem( 'token' ) || errorCode === "TokenExpired" ) {
      try {
        const connectionError = await APIService.callService( 'start', getToken, username );
        if (!!connectionError) {
          console.log('CONNECTION_ERROR', )
          return { connectionError: connectionError};
        }
        console.groupCollapsed( 'DIRECT_LINE >> ACQUIRING_TOKEN' );
        console.log( localStorage.getItem( 'token') )
        console.groupEnd();
        await connectDirectLine();
      } catch (error) {
        console.error( 'DIRECT_LINE >> TOKEN_ERROR ', error );
      }
    }

    async function reconnectDirectLine() {
      try {
        console.log( 'DIRECT_LINE >> RECREATING_DIRECT_LINE' );
        directLine = await createDirectLine( {
          conversationId: localStorage.getItem( 'conversationId' ),
          token: localStorage.getItem( 'token' ),
          streamUrl: localStorage.getItem( 'streamUrl' ),
          webSocket: true,
          watermark: localStorage.getItem( 'watermark' )
        } );
        console.log( 'DIRECT_LINE >> DIRECT_LINE_RECREATED' );
        return directLine;
      } catch (error) {
        error = { message: 'DIRECT_LINE >> RECREATE_DIRECT_LINE_ERROR' }
        return error;
      }
    }

    async function connectDirectLine() {
      try {
        console.log( 'DIRECT_LINE >> CREATING_DIRECT_LINE');
        directLine = await createDirectLine( {
          token: localStorage.getItem( 'token' ),
          webSocket: true,
          conversationStartProperties: {
            // Populates locale property in ConversationUpdate and subsequent activities in bot
            // locale: language ? language : window.navigator.language
            locale: 'fr'
          }
        } );
        console.log( 'DIRECT_LINE >> DIRECT_LINE_CREATED');
        return directLine;
      } catch (error) {
        error = { message: 'DIRECT_LINE >> CREATE_DIRECT_LINE_ERROR' }
        return error;
      }
    }

    if (error) {
      console.error( error.message, error)
    }
    return directLine;
  }

  return process;

})();
