const APIService = ( function () {
  'use strict';

  let errorCode;
  let publicAPIs = {};

  publicAPIs.callService = async function (callType) {
    switch (callType) {
    case 'refresh':
      await refreshedToken();
      break;
    case 'reconnect':
      await reconnectConversation();
      break;
    case 'start':
      await startConversation();
      break;
    case 'speech':
      return await getSpeechToken();
      break;
    }
  }
  
  publicAPIs.getToken = async function () {
    let res = await fetch( 'http://localhost:3500/directline/token', { method: 'POST' } )
    let { token, conversationId } = await res.json();
    if (token && conversationId) {
      return { Token: token, ConversationId: conversationId };
    }
  };
  
  const refreshedToken = async function () {
    const tokenToRefresh = sessionStorage.getItem('token');
    let res = await fetch( 'http://localhost:3500/directline/refresh', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( { token: tokenToRefresh } )
    } );
    const { token: token, conversationId: conversationId, error: error, statusCode: statusCode } = await res.json();
    if (error) {
      console.log(`DIRECT LINE >> SERVICE ERROR >> ${ error }, ${ statusCode }`)
      return;
    }
    sessionStorage.setItem( 'token', token );
    sessionStorage.setItem( 'conversationId', conversationId );
  }
  
  const reconnectConversation = async function () {
    const sessionToken = sessionStorage.getItem( 'token' );
    const sessionConversationId = sessionStorage.getItem( 'conversationId' );
    const sessionWatermark = sessionStorage.getItem( 'watermark' ) === null ? undefined : sessionStorage.getItem( 'watermark' );
  
    let res = await fetch( 'http://localhost:3500/directline/reconnect', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ sessionStorage.getItem( 'token' ) }`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( {
        token: sessionToken,
        conversationId: sessionConversationId,
        watermark: sessionWatermark
      } )
    } );
  
    const { token: token, conversationId: conversationId, streamUrl: streamUrl, error: error } = await res.json();
    if ( error ) {
      console.log( error.code )
      errorCode = error.code;
    }
    sessionStorage.setItem( 'token', token );
    sessionStorage.setItem( 'conversationId', conversationId );
    sessionStorage.setItem( 'streamUrl', streamUrl );
  }
  
  const startConversation = async function () {
    let res = await fetch( 'http://localhost:3500/directline/conversations', { method: 'POST' } );
  
    const { token: token, conversationId: conversationId, streamUrl: streamUrl, error: error } = await res.json();
    if ( error ) {
      console.log( error.code )
      errorCode = error.code;
    }
    sessionStorage.setItem( 'token', token );
    sessionStorage.setItem( 'conversationId', conversationId );
    sessionStorage.setItem( 'streamUrl', streamUrl );
  }
  
  const getSpeechToken = async function (credentials = {}) {
    const response = await fetch( `http://localhost:3500/speechservices/token`, {
      method: 'POST',
    } );
    if ( response.status === 200 ) {
      const { authorizationToken, region } = await response.json();
      credentials['authorizationToken'] = authorizationToken;
      credentials['region'] = region;
      return credentials;
    } else {
      console.log('error')
    }
  }
  
  return publicAPIs;
})();
