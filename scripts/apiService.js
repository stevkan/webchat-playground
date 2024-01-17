const APIService = (function () {
  'use strict';

  const controller = new AbortController();
  const signal = controller.signal;
  let errorCode;
  let publicAPIs = {};

  publicAPIs.callService = async function (callType, getToken, username, arg) {
    switch (callType) {
      case 'refresh':
        return await refreshedToken(getToken);
        break;
      case 'reconnect':
        return await reconnectConversation(getToken);
        break;
      case 'start':
        return await startConversation(getToken, username);
        break;
      case 'speech':
        return await getSpeechToken(getToken);
        break;
    }
    window.getToken = await getToken;
  };

  // const response = await getToken();
  //     if ( response === undefined ) {
  //       console.error( 'Failed to acquire token' );
  //       return;
  //     }

  // publicAPIs.getToken = async function () {
  //   let res = await fetch('http://localhost:3500/directline/token', {
  //     method: 'POST',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     },
  //   });
  //   return await res.json().then(res => {
  //     if (res.token && res.conversationId) {
  //       console.log({ Token: res.token, ConversationId: res.conversationId });
  //     }
  //   });
  // };

  const refreshedToken = async function (getToken) {
    const offline = checkOffline();
    if (offline) {
      return offline;
    } else {
      const tokenToRefresh = localStorage.getItem('token');

      const fetchPromise = new Promise(async resolve => {
        resolve(
          await getToken(null, null, {
            'ms-agent': 'botService-1',
            authorization: true,
            token: tokenToRefresh,
          }),
        );
      });

      const timeoutId = setTimeout(() => controller.abort(), 4000);

      return fetchPromise.then(res => {
        const { token, conversationId, streamUrl } = res;
        if (!token) {
          const error = new Error("Token: Expected a string. Received 'undefined' instead.");
          console.log(`DIRECT_LINE >> SERVICE_ERROR >> ${error}`); // ${statusCode}`);
          return error;
        } else if (token && conversationId && streamUrl) {
          localStorage.setItem('token', token);
          localStorage.setItem('conversationId', conversationId);
          localStorage.setItem('streamUrl', streamUrl);
        }

        clearTimeout(timeoutId);
      });
    }
  };

  const reconnectConversation = async function (getToken) {
    const offline = checkOffline();
    if (offline) {
      return offline;
    } else {
      const sessionToken = localStorage.getItem('token');
      const sessionConversationId = localStorage.getItem('conversationId');
      const sessionWatermark =
        localStorage.getItem('watermark') === null ? undefined : localStorage.getItem('watermark');

      const fetchPromise = new Promise(async resolve => {
        resolve(await getToken(null, null, { 'ms-agent': 'botService-1', authorization: true }));
      });

      // const fetchPromise = fetch('http://localhost:3500/directline/reconnect', {
      //   method: 'POST',
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     token: sessionToken,
      //     conversationId: sessionConversationId,
      //     watermark: sessionWatermark,
      //   }),
      // });

      const timeoutId = setTimeout(() => controller.abort(), 4000);

      return fetchPromise.then(res => {
        const {
          token: token,
          conversationId: conversationId,
          streamUrl: streamUrl,
          error: error,
          statusCode: statusCode,
        } = res;
        if (!!error) {
          console.log(`DIRECT_LINE >> SERVICE_ERROR >> ${error} ${statusCode}`);
        }
        localStorage.setItem('token', token);
        localStorage.setItem('conversationId', conversationId);
        localStorage.setItem('streamUrl', streamUrl);

        clearTimeout(timeoutId);
      });

      // return fetchPromise.then(async res => {
      //   const {
      //     token: token,
      //     conversationId: conversationId,
      //     streamUrl: streamUrl,
      //     error: error,
      //     statusCode: statusCode,
      //   } = await res.json();
      //   if (!!error) {
      //     console.log(`DIRECT_LINE >> SERVICE_ERROR >> ${error} ${statusCode}`);
      //   }
      //   localStorage.setItem('token', token);
      //   localStorage.setItem('conversationId', conversationId);
      //   localStorage.setItem('streamUrl', streamUrl);

      //   clearTimeout(timeoutId);
      // });
    }
  };

  const startConversation = async function (getToken, username) {
    const offline = checkOffline();
    if (offline) {
      return offline;
    } else {
      // const { token, conversationId, streamUrl } = await getToken(null, null, { 'ms-agent': 'botService-1', authorization: true });

      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const body = JSON.stringify({
        user: {
          name: username,
        },
      });

      const fetchPromise = new Promise(async resolve => {
        resolve(
          await getToken(
            null,
            null,
            {
              'ms-agent': 'botService-1',
              authorization: true,
            },
            body,
          ),
        );
      });

      return fetchPromise.then(res => {
        const { token, conversationId, streamUrl } = res;
        if (!token) {
          const error = new Error("Token: Expected a string. Received 'undefined' instead.");
          console.log(`DIRECT_LINE >> SERVICE_ERROR >> ${error}`); // ${statusCode}`);
          return error;
        } else if (token && conversationId && streamUrl) {
          localStorage.setItem('token', token);
          localStorage.setItem('conversationId', conversationId);
          localStorage.setItem('streamUrl', streamUrl);
        }

        clearTimeout(timeoutId);
      });
    }
  };

  const getSpeechToken = async function (credentials = {}) {
    const offline = checkOffline();
    if (offline) {
      return offline;
    } else {
      const fetchPromise = fetch(`http://localhost:3500/speechservices/token`, { method: 'POST' });

      const timeoutId = setTimeout(() => controller.abort(), 4000);

      return fetchPromise.then(async res => {
        if (res.status === 200) {
          const {
            authorizationToken,
            region,
            error: error,
            statusCode: statusCode,
          } = await res.json();
          credentials['authorizationToken'] = authorizationToken;
          credentials['region'] = region;

          clearTimeout(timeoutId);

          return credentials;
        } else {
          console.log(`DIRECT_LINE >> SERVICE_ERROR >> ${error} ${statusCode}`);
        }
      });
    }
  };

  const checkOffline = () => {
    if (!!navigator.onLine === false) {
      return new Error('Connection to internet has been interrupted or disconnected');
    }
  };

  return publicAPIs;
})();
