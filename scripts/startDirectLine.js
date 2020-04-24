const startDirectLine = (function () {
  'use strict';

  let errorCode;
  const process = async function (directLine, serviceType, error) {
    if ( sessionStorage.getItem( 'token' ) ) {
      switch (serviceType) {
        case 'reconnect':
          try {
            await APIService.callService( 'reconnect' )
            console.groupCollapsed( 'DIRECT_LINE >> CONVERSATION_ID_RETRIEVED' );
            console.log( sessionStorage.getItem( 'conversationId' ) );
            console.groupEnd();
            await reconnectDirectLine();
          } catch (error) {
            console.error( 'DIRECT_LINE >> CONVERSATION_ID_ERROR', error );
          }
          break;
        default:
          try {
            await APIService.callService( 'refresh' )
            console.groupCollapsed( 'DIRECT_LINE >> REFRESHING_TOKEN' );
            console.log( sessionStorage.getItem( 'token' ) );
            console.groupEnd();
            await connectDirectLine();
          } catch (error) {
            console.error( 'DIRECT_LINE >> TOKEN_REFRESH_ERROR ', error );
          }
      }
    }
    if ( !sessionStorage.getItem( 'token' ) || errorCode === "TokenExpired" ) {
      try {
        await APIService.callService( 'start' )
        console.groupCollapsed( 'DIRECT_LINE >> ACQUIRING_TOKEN' );
        console.log( sessionStorage.getItem( 'token') )
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
          conversationId: sessionStorage.getItem( 'conversationId' ),
          token: sessionStorage.getItem( 'token' ),
          streamUrl: sessionStorage.getItem( 'streamUrl' ),
          webSocket: true,
          watermark: sessionStorage.getItem( 'watermark' )
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
          token: sessionStorage.getItem( 'token' ),
          webSocket: true
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
