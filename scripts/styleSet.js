'use strict';

const styleSet = ( function() {
  const styleSetCreator = async function(createStyleSet, styleOptions) {
    console.log('SO ', styleOptions)
    const _styleSet = await createStyleSet({
      ...styleOptions
      // backgroundColor: 'Green'
      }
    )

    // _styleSet.options = {
    //   ...styleOptions
    // }
    // let createSet = createStyleSet();
    // return createSet = {
    //   ...createSet,
    //   adaptiveCardRenderer: {
    //   ...createSet.adaptiveCardRenderer,
    //   '& .ac-pushButton:disabled:not(.primary)': { backgroundColor: '#F7F7F7', color: '#717171' },
    //   '& .ac-pushButton.primary:disabled': { backgroundColor: '#0078D7', color: 'Purple' }
    //   },
      
    // }

    for (const prop in styleOptions) {
      if (_styleSet.hasOwnProperty(prop)) {
        console.log(_styleSet[prop]);
        const styleSetProp = _styleSet[prop];
        console.log(styleOptions[prop]);
        const styleOptionsProp = styleOptions[prop];
        
        // _styleSet.options = {
        //   ..._styleSet.options,
        //   ...styleOptionsProp,
        //   ...styleOptions
        // };
        _styleSet[prop] = {
          ...styleSetProp,
          ...styleOptionsProp,
        };
      }
    }

    // console.log('opts ', styleOptions.bubble)
    // _styleSet.bubble = {
    //   ..._styleSet.bubble,
    //   ...styleOptions.bubble
    // };

    _styleSet.textContent = {
      ..._styleSet.textContent,
      color: 'rgba(46, 137, 252, 0.680);',
      fontSize: 'medium',
    };
    
    console.log('ST ', await _styleSet)
    return await _styleSet;
  }
  
  return styleSetCreator;
})();

