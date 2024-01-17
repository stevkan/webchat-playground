const getActivityMiddleware = ( function () {
  'use strict';

  let publicAPIs = {};

  publicAPIs.activityMiddleware = (next, args) => {
    const card = { ...args[0] };
    const children = { ...args[1] };
    console.log('CARD 2 ', card);
    const render = next(card);
    if (render && render !== null && render !== undefined) {
      if (card.activity.type !== 'message') return next(card);
      const {
        activity,
        activity: {
          id,
          from: { role },
          name,
          type,
          value,
        },
      } = card;
      console.log('ACTTTTIIIVVVIIITTTEEE ', activity);
      // if (activity) {
      //   console.log(render)
      // const main = document.querySelector('#webchat');
      // const form = main.querySelector('form');
      // let newForm = document.createElement('form');
      // if ( type === 'event' && value === 'password_input' ) {
      //     newForm.innerHTML = () => {return `<PasswordInputActivity activity={${activity}} nextVisibleActivity={nextVisibleActivity} />`};
      //     main.removeChild(form);
      //     return main.appendChild(newForm);
      //     // return () => <PasswordInputActivity activity={activity} nextVisibleActivity={nextVisibleActivity} />;
      // }
      return (
        render &&
        `
          <div>
            <div key={() => ${id}} className={${role} === 'user' ? 'highlightedActivity--user' : 'highlightedActivity--bot'}>
              {next( ${card} )( ${children} )}
            </div>
          </div>`
      );
      // }
    }
    return next(card);
  };

  return publicAPIs;
})();
